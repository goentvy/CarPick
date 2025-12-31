package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.oauth.OAuthLoginRequest;
import com.carpick.domain.auth.dto.oauth.OAuthLoginResponse;
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
     * OAuth 로그인 처리
     */
    @Transactional
    public OAuthLoginResponse login(String provider, OAuthLoginRequest request) {
        log.info("소셜 로그인 동작: provider={}, code={}", provider, request.getCode());

        User socialUser;

        if ("KAKAO".equalsIgnoreCase(provider)) {
            try {
                String accessToken = kakaoClient.getAccessToken(request.getCode());
                log.info("Kakao accessToken={}", accessToken);
                socialUser = kakaoClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);
            } catch (Exception e) {
                throw new AuthenticationException(ErrorCode.OAUTH_INVALID_CODE);
            }
        } else if ("NAVER".equalsIgnoreCase(provider)) {
            try {
                String accessToken = naverClient.getAccessToken(request.getCode(), request.getState());
                log.info("Naver accessToken={}", accessToken);
                socialUser = naverClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);
            } catch (Exception e) {
                throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
            }
        } else {
            throw new AuthenticationException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }

        // DB 유저 확인 및 신규 가입/복구 처리
        User existUser = userMapper.findByProvider(socialUser.getProvider(), socialUser.getProviderId());

        if (existUser == null) {
            User deletedUser = userMapper.findDeletedByProvider(
                    socialUser.getProvider(),
                    socialUser.getProviderId()
            );

            if (deletedUser != null) {
                userMapper.reviveSocialUser(socialUser.getAccessToken(), deletedUser.getUserId());
                existUser = deletedUser;
            } else {
                if (socialUser.getEmail() == null || socialUser.getEmail().isBlank()) {
                    socialUser.setEmail(provider.toLowerCase() + "_" + socialUser.getProviderId() + "@social.local");
                }

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
                        throw new AuthenticationException(ErrorCode.DB_DUPLICATE_KEY);
                    }
                }
            }
        } else if (existUser.getDeletedAt() != null) {
            userMapper.reviveSocialUser(socialUser.getAccessToken(), existUser.getUserId());
            existUser.setDeletedAt(null);
            existUser.setAccessToken(socialUser.getAccessToken());
        }

        log.info("existUser userId = {}", existUser.getUserId());
        if (existUser.getUserId() == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        String role = (existUser.getMembershipGrade() != null)
                ? existUser.getMembershipGrade()
                : "BASIC";

        String token = jwtProvider.generateToken(existUser.getUserId(), role);

        return OAuthLoginResponse.builder()
                .success(true)
                .token(token)
                .name(existUser.getName())
                .email(existUser.getEmail())
                .provider(existUser.getProvider())
                .build();
    }

    /**
     * 소셜 연동 해제 (카카오/네이버 통합)
     */
    @Transactional
    public void unlinkSocial(String provider, String jwtToken) {
        Long userId = jwtProvider.getUserId(jwtToken);
        User user = userMapper.findById(userId);

        if (user == null || !provider.equalsIgnoreCase(user.getProvider())) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }
        if (user.getAccessToken() == null) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
        }

        if ("KAKAO".equalsIgnoreCase(provider)) {
            String url = "https://kapi.kakao.com/v1/user/unlink";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(user.getAccessToken());

            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

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

        // DB에서 유저 탈퇴 처리 (소셜 유저는 소프트 삭제)
        userMapper.softDeleteSocialUser(userId);
    }
}
