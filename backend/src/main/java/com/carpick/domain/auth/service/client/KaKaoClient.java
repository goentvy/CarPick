package com.carpick.domain.auth.service.client;

import com.carpick.domain.auth.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class KaKaoClient {

    @Value("${KAKAO_CLIENT_ID}")
    private String clientId;

    @Value("${KAKAO_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    /**
     * ✅ 카카오 액세스 토큰 발급
     */
    public String getAccessToken(String code) {
        log.info("KakaoClient.getAccessToken called with code={}", code);

        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        log.info("Kakao token request params: {}", params);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        log.info("Kakao token response status: {}", response.getStatusCode());
        log.info("Kakao token response body: {}", response.getBody());

        if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
            log.error("카카오 토큰 발급 실패: {}", response);
            throw new IllegalStateException("카카오 액세스 토큰 획득 실패");
        }

        return (String) response.getBody().get("access_token");
    }

    /**
     * ✅ 카카오 프로필 조회
     */
    public User getProfile(String accessToken) {
        log.info("KakaoClient.getProfile called with accessToken={}", accessToken);

        String profileUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(profileUrl, request, Map.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            log.error("카카오 프로필 조회 실패: {}", response);
            throw new IllegalStateException("카카오 프로필 조회 실패");
        }

        Map<String, Object> body = response.getBody();
        Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
        Map<String, Object> profile = kakaoAccount != null ? (Map<String, Object>) kakaoAccount.get("profile") : null;

        String email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
        String nickname = profile != null ? (String) profile.get("nickname") : null;

        log.info("Kakao body: {}", body);
        log.info("kakao_account: {}", kakaoAccount);
        log.info("profile: {}", profile);

        return User.builder()
                .email(email)
                .name(nickname)
                .provider("KAKAO")
                .providerId(String.valueOf(body.get("id")))
                .membershipGrade("BASIC")
                .marketingAgree(0)
                .accessToken(accessToken)   // unlink 시 필요
                .password("")               // 기본값 세팅
                .build();
    }
}
