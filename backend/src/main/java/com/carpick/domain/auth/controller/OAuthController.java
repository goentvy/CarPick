package com.carpick.domain.auth.controller;

import com.carpick.domain.auth.dto.oauth.OAuthLoginRequest;
import com.carpick.domain.auth.dto.oauth.OAuthLoginResponse;
import com.carpick.domain.auth.service.OAuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
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
        log.info("소셜 로그인 요청: provider={}", provider);
        OAuthLoginResponse response = oAuthService.login(provider, request);
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ 소셜 연동 해제 (카카오/네이버)
     * 프론트에서 /auth/unlink/{provider} 로 POST 요청
     */
    @PostMapping("/unlink/{provider}")
    public ResponseEntity<Void> unlinkSocial(
            @PathVariable("provider") String provider,
            HttpServletRequest request
    ) {
        // Authorization 헤더에서 JWT 추출
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        String jwtToken = authHeader.substring(7);

        log.info("소셜 연동 해제 요청: provider={}", provider);
        oAuthService.unlinkSocial(provider, jwtToken);
        return ResponseEntity.ok().build();
    }
}