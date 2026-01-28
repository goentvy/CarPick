package com.carpick.domain.auth.controller;

import com.carpick.domain.auth.dto.oauth.OAuthLoginRequest;
import com.carpick.domain.auth.dto.oauth.OAuthLoginResponse;
import com.carpick.domain.auth.service.OAuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oAuthService;

    /* ==================================================
       ✅ 소셜 로그인
       ================================================== */
    @PostMapping("/{provider}")
    public ResponseEntity<OAuthLoginResponse> login(
            @PathVariable String provider,
            @RequestBody OAuthLoginRequest request
    ) {
        return ResponseEntity.ok(
                oAuthService.login(provider, request)
        );
    }

    /* ==================================================
       ✅ 소셜 연동 해제 (JWT 기반)
       ================================================== */
    @PostMapping("/unlink/{provider}")
    public ResponseEntity<Void> unlink(
            @PathVariable String provider,   // UI 식별용 (실제 로직에 사용 ❌)
            @RequestHeader("Authorization") String token
    ) {

        String jwtToken = token.replace("Bearer ", "");

        // 🔥 인자 하나만 넘기는 게 정답
        oAuthService.unlinkSocial(jwtToken);

        return ResponseEntity.ok().build();
    }
}
