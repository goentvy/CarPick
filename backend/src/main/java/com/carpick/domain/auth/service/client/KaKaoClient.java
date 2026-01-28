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
import org.springframework.web.client.HttpClientErrorException;
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


    @PostConstruct
    public void init() {
        log.info("=== ka oauth ===");


    }

    /**
     * ✅ 카카오 액세스 토큰 발급
     */
    public String getAccessToken(String code) {
        log.info("카카오 인가 코드(code={})를 사용해 Access Token을 요청함", code);

        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        log.info("카카오 토큰 요청 파라미터: {}", params);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            // 1. 카카오 서버로 요청 전송
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

            log.info("카카오 토큰 응답 상태 코드: {}", response.getStatusCode());
            log.info("카카오 토큰 응답 본문(body): {}", response.getBody());

            // 2. 응답 본문 검증 (카카오는 보통 'access_token'이라는 키를 사용합니다)
            if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
                log.error("카카오 토큰 발급 실패 (본문 없음): {}", response);
                throw new IllegalStateException("카카오 응답 본문에 access_token이 없습니다.");
            }

            return (String) response.getBody().get("access_token");

        } catch (HttpClientErrorException e) {
            // 3. 중복 요청(KOE320) 또는 기타 4xx 에러 처리
            String errorBody = e.getResponseBodyAsString();
            log.error("카카오 API 호출 중 4xx 에러 발생: {}", errorBody);

            if (errorBody.contains("KOE320")) {
                log.warn("이미 사용된 인가 코드입니다 (중복 요청 방지): code={}", code);
                // 500 에러를 피하기 위해 명확한 의미를 담은 예외를 던집니다.
                throw new IllegalArgumentException("이미 처리된 로그인 요청입니다. 잠시 후 다시 시도해주세요.");
            }

            // 그 외 에러는 그대로 던짐
            throw e;
        } catch (Exception e) {
            // 4. 네트워크 에러 등 기타 예외 처리
            log.error("카카오 토큰 요청 중 예상치 못한 에러 발생", e);
            throw new RuntimeException("카카오 로그인 통신 중 오류가 발생했습니다.");
        }
    }

    /**
     * ✅ 카카오 프로필 조회
     */
    public User getProfile(String accessToken) {
        log.info("카카오 사용자 정보 조회 요청 - accessToken 전달됨={}", accessToken);

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
//                .accessToken(accessToken)   // unlink 시 필요
                .password("")               // 기본값 세팅
                .build();
    }
}
