package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.oauth.OAuthLoginRequest;
import com.carpick.domain.auth.dto.oauth.OAuthLoginResponse;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.domain.auth.service.client.KaKaoClient;
import com.carpick.domain.auth.service.client.NaverClient;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
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


    /* ==================================================
       소셜 로그인
    ================================================== */
    @Transactional
    public OAuthLoginResponse login(String provider, OAuthLoginRequest request) {
        log.info("소셜 로그인 동작: provider={}, code={}", provider, request.getCode());

        User socialUser;

        /* 1️⃣ 소셜 토큰 발급 + 프로필 조회 */
        try {
            if ("KAKAO".equalsIgnoreCase(provider)) {
                String accessToken = kakaoClient.getAccessToken(request.getCode());
                socialUser = kakaoClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);

            } else if ("NAVER".equalsIgnoreCase(provider)) {
                String accessToken = naverClient.getAccessToken(
                        request.getCode(),
                        request.getState()
                );
                socialUser = naverClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);

            } else {
                throw new AuthenticationException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
            }
        } catch (Exception e) {
            throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
        }

        /* 2️⃣ provider + providerId 기준 기존 유저 조회 */
        User existUser = userMapper.findByProvider(
                socialUser.getProvider(),
                socialUser.getProviderId()
        );

        /* 3️⃣ 신규 / 복구 / 차단 처리 */
        if (existUser == null) {

            // 3-1️⃣ 소프트 탈퇴 이력 복구
            User deletedUser = userMapper.findDeletedByProvider(
                    socialUser.getProvider(),
                    socialUser.getProviderId()
            );

            if (deletedUser != null) {
                userMapper.reviveSocialUser(
                        socialUser.getAccessToken(),
                        deletedUser.getUserId()
                );
                existUser = deletedUser;

            } else {
                // 3-2️⃣ 이메일 세팅 (없으면 더미)
                if (socialUser.getEmail() == null || socialUser.getEmail().isBlank()) {
                    socialUser.setEmail(
                            provider.toLowerCase() + "_" +
                                    socialUser.getProviderId() + "@social.local"
                    );
                }

                // 🔥 이메일 중복 차단
                User emailUser = userMapper.findByEmail(socialUser.getEmail());
                if (emailUser != null) {
                    throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
                }

                // 3-3️⃣ 신규 소셜 가입
                socialUser.setPassword("");
                socialUser.setMembershipGrade("BASIC");

                // ✅ DB 안 건드리기: gender는 NULL로 저장
                socialUser.setGender(null);

                if (socialUser.getMarketingAgree() == null) {
                    socialUser.setMarketingAgree(0);
                }

                userMapper.insertSocialUser(socialUser);

                // INSERT 후 PK 재조회
                existUser = userMapper.findByProvider(
                        socialUser.getProvider(),
                        socialUser.getProviderId()
                );

                if (existUser == null || existUser.getUserId() == null) {
                    throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
                }
            }

        } else if (existUser.getDeletedAt() != null) {
            // 4️⃣ 소프트 삭제된 유저 복구
            userMapper.reviveSocialUser(
                    socialUser.getAccessToken(),
                    existUser.getUserId()
            );
            existUser.setDeletedAt(null);
            existUser.setAccessToken(socialUser.getAccessToken());
        }

        /* 5️⃣ 최종 안전 체크 */
        if (existUser == null || existUser.getUserId() == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        /* 6️⃣ JWT 발급 */
        String role = (existUser.getMembershipGrade() != null)
                ? existUser.getMembershipGrade()
                : "BASIC";

        String token = jwtProvider.generateToken(
                existUser.getUserId(),
                role
        );

        return OAuthLoginResponse.builder()
                .success(true)
                .token(token)
                .name(existUser.getName())
                .email(existUser.getEmail())
                .provider(existUser.getProvider())
                .build();
    }

    /* ==================================================
       소셜 연동 해제
    ================================================== */
    @Transactional
    public void unlinkSocial(String provider, String jwtToken) {

        Long userId = jwtProvider.getUserId(jwtToken);

        User user = userMapper.findById(userId);
        if (user == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        if (!provider.equalsIgnoreCase(user.getProvider())) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        if (user.getAccessToken() == null || user.getAccessToken().isBlank()) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
        }

        if ("KAKAO".equalsIgnoreCase(provider)) {

            String url = "https://kapi.kakao.com/v1/user/unlink";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(user.getAccessToken());

            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new AuthenticationException(ErrorCode.OAUTH_PROVIDER_ERROR);
            }

            log.info("카카오 연동 해제 완료: userId={}", userId);

        } else if ("NAVER".equalsIgnoreCase(provider)) {

            naverClient.unlink(user.getAccessToken());
            log.info("네이버 연동 해제 완료: userId={}", userId);

        } else {
            throw new AuthenticationException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }

        // 소셜 계정은 소프트 탈퇴
        userMapper.softDeleteSocialUser(userId);
    }
}
