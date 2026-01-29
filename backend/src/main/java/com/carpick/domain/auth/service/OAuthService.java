package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.oauth.OAuthLoginRequest;
import com.carpick.domain.auth.dto.oauth.OAuthLoginResponse;
import com.carpick.domain.auth.entity.Role;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.domain.auth.service.client.KaKaoClient;
import com.carpick.domain.auth.service.client.NaverClient;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthService {

    private final KaKaoClient kakaoClient;
    private final NaverClient naverClient;
    private final UserMapper userMapper;
    private final JwtProvider jwtProvider;

    /* ==================================================
       ✅ 소셜 로그인 (JWT 분리형 구조)
       ================================================== */
    @Transactional
    public OAuthLoginResponse login(String provider, OAuthLoginRequest request) {

        String normalizedProvider = provider.toUpperCase();
        User socialUser;

        /* =====================
           1️⃣ OAuth 인증
           ===================== */
        try {
            if ("KAKAO".equals(normalizedProvider)) {
                String oauthToken = kakaoClient.getAccessToken(request.getCode());
                socialUser = kakaoClient.getProfile(oauthToken);
                socialUser.setProvider("KAKAO");

            } else if ("NAVER".equals(normalizedProvider)) {
                String oauthToken = naverClient.getAccessToken(
                        request.getCode(),
                        request.getState()
                );
                socialUser = naverClient.getProfile(oauthToken);
                socialUser.setProvider("NAVER");

            } else {
                throw new AuthenticationException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
            }

        } catch (Exception e) {
            log.error("OAuth 인증 실패", e);
            throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
        }

        if (socialUser.getProviderId() == null || socialUser.getProviderId().isBlank()) {
            throw new AuthenticationException(ErrorCode.OAUTH_PROVIDER_ERROR);
        }

        /* =====================
           2️⃣ 기존 계정 조회
           ===================== */
        User existUser = userMapper.findByProvider(
                socialUser.getProvider(),
                socialUser.getProviderId()
        );

        /* =====================
           3️⃣ 삭제 계정 복구
           ===================== */
        if (existUser == null) {
            User deletedUser = userMapper.findDeletedByProvider(
                    socialUser.getProvider(),
                    socialUser.getProviderId()
            );

            if (deletedUser != null) {
                userMapper.reviveSocialUserBasic(
                        deletedUser.getUserId(),
                        normalizedProvider.toLowerCase() + "_" + socialUser.getProviderId() + "@social.local",
                        socialUser.getName()
                );
                existUser = userMapper.findById(deletedUser.getUserId());
            }
        }

        /* =====================
           4️⃣ 신규 가입
           ===================== */
        if (existUser == null) {

            // ✅ 새로운 User 객체 생성 (깔끔하게)
            User newUser = new User();
            newUser.setProvider(normalizedProvider);  // ✅ KAKAO 또는 NAVER
            newUser.setProviderId(socialUser.getProviderId());
            newUser.setEmail(normalizedProvider.toLowerCase() + "_" + socialUser.getProviderId() + "@social.local");
            newUser.setName(socialUser.getName());
            newUser.setPassword(null);
            newUser.setGender(null);
            newUser.setMembershipGrade("BASIC");
            newUser.setRole(Role.USER);
            newUser.setMarketingAgree(
                    socialUser.getMarketingAgree() != null ? socialUser.getMarketingAgree() : 0
            );

            log.info("🔥 INSERT SOCIAL - provider: {}, providerId: {}, email: {}",
                    newUser.getProvider(),
                    newUser.getProviderId(),
                    newUser.getEmail());

            userMapper.insertSocialUser(newUser);

            // ✅ provider와 providerId로 다시 조회
            existUser = userMapper.findByProvider(
                    newUser.getProvider(),
                    newUser.getProviderId()
            );
        }

        if (existUser == null || existUser.getUserId() == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        /* =====================
           5️⃣ JWT 발급 (Role 기반)
           ===================== */
        String accessToken = jwtProvider.generateAccessToken(
                existUser.getUserId(),
                existUser.getRole().name()
        );

        return OAuthLoginResponse.builder()
                .success(true)
                .accessToken(accessToken)
                .name(existUser.getName())
                .email(existUser.getEmail())
                .provider(existUser.getProvider())
                .role(existUser.getRole())
                .build();
    }

    /* ==================================================
       ✅ 소셜 연동 해제
       ================================================== */
    @Transactional
    public void unlinkSocial(String jwtToken) {

        Long userId = jwtProvider.getUserId(jwtToken);

        User user = userMapper.findById(userId);
        if (user == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        userMapper.unlinkSocialAccount(userId);

        log.info("소셜 연동 해제 완료 userId={}", userId);
    }
}