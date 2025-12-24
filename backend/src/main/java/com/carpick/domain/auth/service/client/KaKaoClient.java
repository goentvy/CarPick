package com.carpick.domain.auth.service.client;

import com.carpick.domain.auth.entity.User;
import jakarta.annotation.PostConstruct;
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

    // redirect-uri는 보안상 설정파일(yml)이나 환경변수 관리가 맞습니다.
    @Value("${KAKAO_REDIRECT_URI}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    @PostConstruct
    public void init() {
        log.info("=== Kakao OAuth Config ===");
        log.info("Client ID: {}", clientId);
        log.info("Client Secret: {}", clientSecret != null ? "****" : "null");
        log.info("Redirect URI: {}", redirectUri);
        log.info("==========================");
    }

    /**
     * ✅ 팩트 체크: 토큰 요청 시 client_secret 추가 필수
     */
    public String getAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret); // 👈 보안 핵심: 누락되었던 시크릿 키 추가
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        // 카카오 토큰 API는 POST 방식 사용
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
            throw new RuntimeException("카카오 액세스 토큰 획득 실패");
        }

        return (String) response.getBody().get("access_token");
    }

    /**
     * ✅ 팩트 체크: 카카오 고유 ID는 Long 타입이므로 String.valueOf로 안전하게 변환
     */
    public User getProfile(String accessToken) {
        String profileUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        // 프로필 조회는 POST/GET 둘 다 가능하지만 POST 권장
        ResponseEntity<Map> response = restTemplate.postForEntity(profileUrl, request, Map.class);
        Map<String, Object> body = response.getBody();

        // 카카오 JSON 계층 구조 파싱
        Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        log.info("Kakao body: {}", body);
        log.info("kakao_account: {}", kakaoAccount);
        log.info("profile: {}", profile);

        return User.builder()
                .email((String) kakaoAccount.get("email"))
                .name((String) profile.get("nickname")) // 카카오는 nickname 사용
                .provider("KAKAO")
                .providerId(String.valueOf(body.get("id"))) // 고유 ID 추출
                .build();
    }
}