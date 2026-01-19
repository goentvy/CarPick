package com.carpick.domain.auth.service.client;

import com.carpick.domain.auth.entity.Gender;
import com.carpick.domain.auth.entity.Role;
import com.carpick.domain.auth.entity.User;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class NaverClient {

    @Value("${NAVER_CLIENT_ID:}")
    private String clientId;

    @Value("${NAVER_CLIENT_SECRET:}")
    private String clientSecret;

    @Value("${naver.redirect-uri:}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    @PostConstruct
    public void init() {
        log.info("[NAVER] OAuth Client initialized");
    }

    /**
     * =========================
     * 네이버 AccessToken 발급
     * =========================
     */
    public String getAccessToken(String code, String state) {

        if (isBlank(clientId) || isBlank(clientSecret) || isBlank(redirectUri)) {
            log.error("[NAVER][CONFIG] 환경변수 누락");
            throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
        }

        String url = "https://nid.naver.com/oauth2.0/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        params.add("state", state);

        try {
            ResponseEntity<Map<String, Object>> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            new HttpEntity<>(params, headers),
                            new ParameterizedTypeReference<>() {}
                    );

            Map<String, Object> body = response.getBody();
            if (body == null || body.get("access_token") == null) {
                throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
            }

            return body.get("access_token").toString();

        } catch (HttpStatusCodeException e) {
            if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                throw new AuthenticationException(ErrorCode.OAUTH_INVALID_CODE);
            }
            throw new AuthenticationException(ErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
        }
    }

    /**
     * =========================
     * 네이버 사용자 프로필 조회
     * =========================
     */
    @SuppressWarnings("unchecked")
    public User getProfile(String accessToken) {

        if (isBlank(accessToken)) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
        }

        String url = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        try {
            ResponseEntity<Map<String, Object>> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            new HttpEntity<>(headers),
                            new ParameterizedTypeReference<>() {}
                    );

            Map<String, Object> body = response.getBody();
            if (body == null || !body.containsKey("response")) {
                throw new AuthenticationException(ErrorCode.OAUTH_PROVIDER_ERROR);
            }

            Map<String, Object> data = (Map<String, Object>) body.get("response");

            String providerId = (String) data.get("id");
            if (providerId == null) {
                throw new AuthenticationException(ErrorCode.OAUTH_PROVIDER_ERROR);
            }

            return User.builder()
                    .email((String) data.get("email"))
                    .provider("NAVER")
                    .providerId(providerId)
                    .name((String) data.getOrDefault("name", "네이버사용자"))
                    .phone((String) data.get("mobile"))
                    .birth(parseBirth(data))
                    .gender(parseGender(data))   // ✅ 핵심 수정
                    .role(Role.USER)
                    .membershipGrade("BASIC")
                    .marketingAgree(0)
                    .build();

        } catch (HttpStatusCodeException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
            }
            throw new AuthenticationException(ErrorCode.OAUTH_PROVIDER_ERROR);
        }
    }

    // =========================
    // private helpers
    // =========================

    private Gender parseGender(Map<String, Object> data) {
        try {
            String value = (String) data.get("gender"); // "M" / "F"
            return value == null ? null : Gender.valueOf(value);
        } catch (Exception e) {
            log.warn("[NAVER][PROFILE] gender 파싱 실패 data={}", data);
            return null;
        }
    }

    private LocalDate parseBirth(Map<String, Object> data) {
        try {
            String year = (String) data.get("birthyear");
            String day = (String) data.get("birthday"); // MM-DD
            if (year != null && day != null) {
                return LocalDate.parse(year + "-" + day);
            }
        } catch (Exception e) {
            log.warn("[NAVER][PROFILE] 생년월일 파싱 실패 data={}", data);
        }
        return null;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
