package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.OAuthLoginRequest;
import com.carpick.domain.auth.dto.OAuthLoginResponse;
import com.carpick.domain.auth.entity.Gender;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.domain.auth.service.client.KaKaoClient;
import com.carpick.domain.auth.service.client.NaverClient;
import com.carpick.global.security.jwt.JwtProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; // Spring 트랜잭션 권장
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

    @Transactional
    public OAuthLoginResponse login(String provider, OAuthLoginRequest request) {
        log.info("OAuth login start: provider={}, code={}", provider, request.getCode());

        User socialUser;
        if ("KAKAO".equalsIgnoreCase(provider)) {
            String accessToken = kakaoClient.getAccessToken(request.getCode());
            log.info("Kakao accessToken={}", accessToken); // 카카오 액세스 토큰 확인
            socialUser = kakaoClient.getProfile(accessToken);
            // ✅ 로그인 시 액세스 토큰 저장 (연동 해제 시 필요)
            socialUser.setAccessToken(accessToken);
        } else if ("NAVER".equalsIgnoreCase(provider)) {
            String accessToken = naverClient.getAccessToken(request.getCode(), request.getState());
            log.info("Naver accessToken={}", accessToken); // 네이버 액세스 토큰 확인
            socialUser = naverClient.getProfile(accessToken);
            socialUser.setAccessToken(accessToken);
        } else {
            throw new IllegalArgumentException("지원하지 않는 소셜 서비스입니다: " + provider);
        }

        // DB에서 기존 유저 확인
        User existUser = userMapper.findByProvider(socialUser.getProvider(), socialUser.getProviderId());

        if (existUser == null) {
            if (socialUser.getEmail() == null || socialUser.getEmail().isBlank()) {
                socialUser.setEmail(provider.toLowerCase() + "_" + socialUser.getProviderId() + "@social.local");
            }
            socialUser.setPassword("");
            socialUser.setMembershipGrade("BASIC");
            if (socialUser.getGender() == null) socialUser.setGender(Gender.UNKNOWN);
            if (socialUser.getMarketingAgree() == null) socialUser.setMarketingAgree(0);

            userMapper.insertSocialUser(socialUser);
            existUser = socialUser;
        }
        log.info("existUser userId = {}", existUser.getUserId());
        if (existUser.getUserId() == null) {
            throw new IllegalStateException("UserId가 null입니다. DB INSERT/조회 로직을 확인하세요.");
        }

        String role = (existUser.getMembershipGrade() != null) ? existUser.getMembershipGrade() : "BASIC";
        String token = jwtProvider.generateToken(existUser.getUserId(), role);

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
            throw new IllegalStateException("카카오 연동된 계정이 아닙니다.");
        }
        if (user.getAccessToken() == null) {
            throw new IllegalStateException("카카오 액세스 토큰이 없습니다. 다시 로그인 후 시도하세요.");
        }

        String url = "https://kapi.kakao.com/v1/user/unlink";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(user.getAccessToken()); // ✅ 액세스 토큰 사용

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IllegalStateException("카카오 연동 해제 실패: " + response.getBody());
        }

        // DB에서 유저 탈퇴 처리 (소셜 유저는 하드 삭제)
        userMapper.hardDeleteSocialUser(userId);
        log.info("카카오 연동 해제 완료: userId={}", userId);
    }
}