package com.carpick.domain.auth.controller;

import com.carpick.domain.auth.dto.OAuthLoginRequest;
import com.carpick.domain.auth.dto.OAuthLoginResponse;
import com.carpick.domain.auth.service.OAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oAuthService;

    /**
     * 소셜 로그인 통합 엔드포인트
     *
     * @param provider "kakao" 또는 "naver" (경로 변수)
     * @param request  프론트에서 보낸 인가 코드(code)와 상태값(state)
     * @return 보안 DTO에 담긴 토큰 및 사용자 정보
     */
    @PostMapping("/login/{provider}")
    public ResponseEntity<OAuthLoginResponse> socialLogin(
            @PathVariable("provider") String provider,
            @RequestBody OAuthLoginRequest request
    ) {
        // 1. 서비스(두뇌) 호출하여 로직 수행
        OAuthLoginResponse response = oAuthService.login(provider, request);

        // 2. 성공 응답 반환 (200 OK)
        return ResponseEntity.ok(response);
    }
}