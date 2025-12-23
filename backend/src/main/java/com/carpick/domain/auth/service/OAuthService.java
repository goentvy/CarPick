package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.OAuthLoginRequest;
import com.carpick.domain.auth.dto.OAuthLoginResponse;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.domain.auth.service.client.KaKaoClient;
import com.carpick.domain.auth.service.client.NaverClient;
import com.carpick.global.security.jwt.JwtProvider;
import org.springframework.transaction.annotation.Transactional; // Spring 트랜잭션 권장
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final KaKaoClient kakaoClient;
    private final NaverClient naverClient;
    private final UserMapper userMapper;
    private final JwtProvider jwtProvider;

    // ❌ private final User user; -> 이 줄은 삭제되었습니다.
    // 이유는 User는 DB 데이터이지, 주입받는 서비스 객체가 아니기 때문입니다.

    @Transactional
    public OAuthLoginResponse login(String provider, OAuthLoginRequest request) {
        // 1. 소셜 서비스로부터 유저 정보를 가져옴
        User socialUser;
        if ("KAKAO".equalsIgnoreCase(provider)) {
            String accessToken = kakaoClient.getAccessToken(request.getCode());
            socialUser = kakaoClient.getProfile(accessToken);
        } else if ("NAVER".equalsIgnoreCase(provider)) {
            String accessToken = naverClient.getAccessToken(request.getCode(), request.getState());
            socialUser = naverClient.getProfile(accessToken);
        } else {
            throw new IllegalArgumentException("지원하지 않는 소셜 서비스입니다: " + provider);
        }

        // 2. DB에서 기존 유저 확인 (provider + providerId 조합)
        User existUser = userMapper.findByProvider(socialUser.getProvider(), socialUser.getProviderId());

        if (existUser == null) {
            // 3. 회원가입 없이 즉시 저장 (간편 로그인 가입)
            // 인자로 받은 socialUser(Entity)를 직접 사용하여 보안 유지
            userMapper.insertSocialUser(socialUser);
            existUser = socialUser;
        }

        // 4. JwtProvider를 사용하여 토큰 발행 (로컬 로그인과 동일한 방식)
        // role(등급)이 null일 경우를 대비해 안전하게 "BASIC" 처리
        String role = (existUser.getMembershipGrade() != null)
                ? existUser.getMembershipGrade().toString()
                : "BASIC";

        String token = jwtProvider.generateToken(
                existUser.getUserId(),
                role
        );

        // 5. 보안 DTO(Response)에 담아 반환 (최종 결과)
        return OAuthLoginResponse.builder()
                .success(true)
                .token(token)
                .name(existUser.getName())
                .email(existUser.getEmail())
                .build();
    }
}