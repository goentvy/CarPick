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
       소셜 로그인 (실서버 안정)
    ================================================== */
    @Transactional
    public OAuthLoginResponse login(String provider, OAuthLoginRequest request) {

        String normalizedProvider = provider.toUpperCase();
        User socialUser;

        /* 1️⃣ 토큰 + 프로필 */
        try {
            if ("KAKAO".equals(normalizedProvider)) {
                String accessToken = kakaoClient.getAccessToken(request.getCode());
                socialUser = kakaoClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);
                socialUser.setProvider("KAKAO");

            } else if ("NAVER".equals(normalizedProvider)) {
                String accessToken = naverClient.getAccessToken(
                        request.getCode(),
                        request.getState()
                );
                socialUser = naverClient.getProfile(accessToken);
                socialUser.setAccessToken(accessToken);
                socialUser.setProvider("NAVER");

            } else {
                throw new AuthenticationException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
            }
        } catch (Exception e) {
            log.error("OAuth 토큰/프로필 실패", e);
            throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
        }

        if (socialUser.getProviderId() == null || socialUser.getProviderId().isBlank()) {
            throw new AuthenticationException(ErrorCode.OAUTH_PROVIDER_ERROR);
        }

        /* 2️⃣ 기존 계정 */
        User existUser = userMapper.findByProvider(
                socialUser.getProvider(),
                socialUser.getProviderId()
        );

        /* 3️⃣ 삭제 계정 복구 */
        if (existUser == null) {
            User deletedUser = userMapper.findDeletedByProvider(
                    socialUser.getProvider(),
                    socialUser.getProviderId()
            );

            if (deletedUser != null) {
                userMapper.reviveSocialUserFull(
                        deletedUser.getUserId(),
                        socialUser.getAccessToken(),
                        resolveEmail(socialUser),
                        socialUser.getName()
                );
                existUser = userMapper.findById(deletedUser.getUserId());
            }
        }

        /* 4️⃣ 신규 가입 */
        if (existUser == null) {
            socialUser.setEmail(resolveEmail(socialUser));
            socialUser.setPassword("");
            socialUser.setMembershipGrade("BASIC");
            socialUser.setGender(null);
            socialUser.setMarketingAgree(
                    socialUser.getMarketingAgree() != null ? socialUser.getMarketingAgree() : 0
            );

            userMapper.insertSocialUser(socialUser);
            existUser = userMapper.findById(socialUser.getUserId());
        }

        /* 5️⃣ 최종 방어 */
        if (existUser == null || existUser.getUserId() == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        /* 6️⃣ JWT */
        String token = jwtProvider.generateToken(
                existUser.getUserId(),
                existUser.getMembershipGrade() != null
                        ? existUser.getMembershipGrade()
                        : "BASIC"
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
          소셜 연동 해제 (컨트롤러용)
          ❗ 실서버 안정 목적: 최소 동작
       ================================================== */
    @Transactional
    public void unlinkSocial(String provider, String jwtToken) {

        Long userId = jwtProvider.getUserId(jwtToken);

        User user = userMapper.findById(userId);
        if (user == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        // 연동 해제 = accessToken만 제거
        userMapper.updateAccessToken(userId, null);

        log.info("소셜 연동 해제 완료 userId={}, provider={}", userId, provider);
    }
    private String resolveEmail(User user) {
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            return user.getEmail();
        }
        return user.getProvider().toLowerCase()
                + "_" + user.getProviderId()
                + "@social.local";
    }
}
