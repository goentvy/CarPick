package com.carpick.domain.auth.service.client;

import com.carpick.domain.auth.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class NaverClient {
    // 인텔리제이 환경변수 ${NAVER_CLIENT_ID}와 ${NAVER_CLIENT_SECRET}를 가져옴
    @Value("${NAVER_CLIENT_ID}")
    private String clientId;

    @Value("${NAVER_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    public String getAccessToken(String code, String state) {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";

        // 네이버는 URL 뒤에 파라미터를 붙이는 방식을 선호함
        String url = UriComponentsBuilder.fromHttpUrl(tokenUrl)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("code", code)
                .queryParam("state", state)
                .toUriString();

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        return (String) response.getBody().get("access_token");
    }

    public User getProfile(String accessToken) {
        String profileUrl = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        // 네이버 프로필 API는 GET 호출
        ResponseEntity<Map> response = restTemplate.exchange(profileUrl, HttpMethod.GET, request, Map.class);
        Map<String, Object> responseData = (Map<String, Object>) response.getBody().get("response");

        return User.builder()
                .email((String) responseData.get("email"))
                .name((String) responseData.get("name"))
                .provider("NAVER")
                .providerId((String) responseData.get("id"))
                .build();
    }
}
