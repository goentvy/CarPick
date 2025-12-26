package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.OAuthLoginRequest;
import com.carpick.domain.auth.dto.OAuthLoginResponse;
import com.carpick.domain.auth.entity.Gender;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.domain.auth.service.client.KaKaoClient;
import com.carpick.domain.auth.service.client.NaverClient;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.security.jwt.JwtProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthService {

    private final KaKaoClient kakaoClient;
    private final NaverClient naverClient;
    private final UserMapper userMapper;
    private final JwtProvider jwtProvider;
    private final RestTemplate restTemplate;

    /**
     * 🔑 OAuth 로그인 처리
     * - 카카오 / 네이버 OAuth 인증 코드로 액세스 토큰 발급
     * - 프로필 조회 후 DB 사용자 확인 및 신규 가입/복구 처리
     * - JWT 토큰 발급하여 응답 반환
     */
    @Transactional
    public OAuthLoginResponse login(String provider, OAuthLoginRequest request) {
        log.info("소셜 로그인 동작: provider={}, code={}", provider, request.getCode());

        User socialUser;

        // ✅ 1. Provider별 액세스 토큰 발급 및 프로필 조회
        if ("KAKAO".equalsIgnoreCase(provider)) {
            try {
                String accessToken = kakaoClient.getAccessToken(request.getCode());
                log.info("Kakao accessToken={}", accessToken);
                socialUser = kakaoClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);
            } catch (Exception e) {
                // 카카오 인증 코드 오류
                throw new AuthenticationException(ErrorCode.OAUTH_INVALID_CODE);
            }
        } else if ("NAVER".equalsIgnoreCase(provider)) {
            try {
                String accessToken = naverClient.getAccessToken(request.getCode(), request.getState());
                log.info("Naver accessToken={}", accessToken);
                socialUser = naverClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);
            } catch (Exception e) {
                // 네이버 토큰 교환 실패
                throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
            }
        } else {
            // 지원하지 않는 소셜 서비스
            throw new AuthenticationException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }

        // ✅ 2. DB에서 기존 유저 확인
        User existUser = userMapper.findByProvider(socialUser.getProvider(), socialUser.getProviderId());

        if (existUser == null) {
            // 🔄 소프트 삭제된 유저 조회
            User deletedUser = userMapper.findDeletedByProvider(
                    socialUser.getProvider(),
                    socialUser.getProviderId()
            );

            if (deletedUser != null) {
                // ▶ 소프트 삭제된 계정 복구
                userMapper.reviveSocialUser(socialUser.getAccessToken(), deletedUser.getUserId());
                existUser = deletedUser;
            } else {
                // 🆕 신규 가입 처리
                if (socialUser.getEmail() == null || socialUser.getEmail().isBlank()) {
                    socialUser.setEmail(provider.toLowerCase() + "_" + socialUser.getProviderId() + "@social.local");
                }

                // 📧 이메일 중복 방지 처리
                if (userMapper.existsByEmail(socialUser.getEmail()) > 0) {
                    log.warn("이메일 중복 발생: {}", socialUser.getEmail());
                    existUser = userMapper.findByProvider(socialUser.getProvider(), socialUser.getProviderId());
                } else {
                    try {
                        socialUser.setPassword("");
                        socialUser.setMembershipGrade("BASIC");
                        if (socialUser.getGender() == null) socialUser.setGender(Gender.UNKNOWN);
                        if (socialUser.getMarketingAgree() == null) socialUser.setMarketingAgree(0);

                        userMapper.insertSocialUser(socialUser);
                        existUser = socialUser;
                    } catch (Exception e) {
                        // DB 제약조건 위반 (중복 키 등)
                        throw new AuthenticationException(ErrorCode.DB_DUPLICATE_KEY);
                    }
                }
            }
        } else if (existUser.getDeletedAt() != null) {
            // ▶ 소프트 삭제된 계정 복구
            userMapper.reviveSocialUser(socialUser.getAccessToken(), existUser.getUserId());
            existUser.setDeletedAt(null);
            existUser.setAccessToken(socialUser.getAccessToken());
        }

        // ✅ 3. UserId 검증
        log.info("existUser userId = {}", existUser.getUserId());
        if (existUser.getUserId() == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        // ✅ 4. JWT 토큰 발급
        String role = (existUser.getMembershipGrade() != null)
                ? existUser.getMembershipGrade()
                : "BASIC";

        String token = jwtProvider.generateToken(existUser.getUserId(), role);

        // ✅ 5. 로그인 응답 반환
        return OAuthLoginResponse.builder()
                .success(true)
                .token(token)
                .name(existUser.getName())
                .email(existUser.getEmail())
                .build();
    }


    /**
     * ✅ 카카오 연동 해제
     */
    @Transactional
    public void unlinkKakao(String jwtToken) {
        Long userId = jwtProvider.getUserId(jwtToken);
        User user = userMapper.findById(userId);

        if (user == null || !"KAKAO".equalsIgnoreCase(user.getProvider())) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }
        if (user.getAccessToken() == null) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
        }

        String url = "https://kapi.kakao.com/v1/user/unlink";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(user.getAccessToken());

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new AuthenticationException(ErrorCode.OAUTH_PROVIDER_ERROR);
        }

        // DB에서 유저 탈퇴 처리 (소셜 유저는 소프트 삭제)
        userMapper.softDeleteSocialUser(userId);
        log.info("카카오 연동 해제 완료: userId={}", userId);
    }
}
