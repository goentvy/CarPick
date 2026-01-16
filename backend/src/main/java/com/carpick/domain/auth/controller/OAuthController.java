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
     * 소셜 로그인 (NAVER / KAKAO)
     * ❗ 비인증 엔드포인트
     */
    @PostMapping("/login/{provider}")
    public ResponseEntity<OAuthLoginResponse> socialLogin(
            @PathVariable String provider,
            @RequestBody OAuthLoginRequest request
    ) {
        log.info("[OAUTH-LOGIN] provider={}", provider);

        OAuthLoginResponse response = oAuthService.login(provider, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 소셜 연동 해제 (NAVER / KAKAO)
     * ❗ 인증 필요 (JWT)
     */
    @PostMapping("/unlink/{provider}")
    public ResponseEntity<Void> unlinkSocial(
            @PathVariable String provider,
            HttpServletRequest request
    ) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String jwtToken = authHeader.substring(7);

        log.info("[OAUTH-UNLINK] provider={}", provider);

        oAuthService.unlinkSocial(provider, jwtToken);
        return ResponseEntity.ok().build();
    }
}
