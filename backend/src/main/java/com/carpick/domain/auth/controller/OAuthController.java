package com.carpick.domain.auth.controller;

import com.carpick.domain.auth.dto.oauth.OAuthLoginRequest;
import com.carpick.domain.auth.dto.oauth.OAuthLoginResponse;
import com.carpick.domain.auth.service.OAuthService;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
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
     * =========================
     * 소셜 로그인 (NAVER / KAKAO)
     * ❗ 비인증 엔드포인트
     * =========================
     */
    @PostMapping("/login/{provider}")
    public ResponseEntity<OAuthLoginResponse> socialLogin(
            @PathVariable String provider,
            @RequestBody(required = false) OAuthLoginRequest request
    ) {
        // 🔥 1. 컨트롤러 진입 확인
        log.info("[OAUTH][LOGIN] controller 진입");
        log.info("[OAUTH][LOGIN] provider={}", provider);

        // 🔥 2. provider 방어
        if (provider == null || provider.isBlank()) {
            log.error("[OAUTH][LOGIN] provider is null or blank");
            throw new AuthenticationException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 🔥 3. request body 방어 (여기서 실서버 500 가장 많이 터짐)
        if (request == null) {
            log.error("[OAUTH][LOGIN] request body is null");
            throw new AuthenticationException(ErrorCode.INVALID_INPUT_VALUE);
        }

        log.info("[OAUTH][LOGIN] request 수신 완료");
        log.info("[OAUTH][LOGIN] code={}, state={}",
                request.getCode(), request.getState());

        // 🔥 4. 필수 값 검증
        if (request.getCode() == null || request.getCode().isBlank()) {
            log.error("[OAUTH][LOGIN] authorization code is null or blank");
            throw new AuthenticationException(ErrorCode.OAUTH_INVALID_CODE);
        }

        // state는 선택이지만 로그는 남긴다
        if (request.getState() == null) {
            log.warn("[OAUTH][LOGIN] state is null");
        }

        // 🔥 5. 서비스 호출
        log.info("[OAUTH][LOGIN] OAuthService 호출 시작");

        OAuthLoginResponse response = oAuthService.login(provider, request);

        log.info("[OAUTH][LOGIN] OAuthService 처리 완료");
        return ResponseEntity.ok(response);
    }

    /**
     * =========================
     * 소셜 연동 해제 (NAVER / KAKAO)
     * ❗ 인증 필요 (JWT)
     * =========================
     */
    @PostMapping("/unlink/{provider}")
    public ResponseEntity<Void> unlinkSocial(
            @PathVariable String provider,
            HttpServletRequest request
    ) {
        log.info("[OAUTH][UNLINK] controller 진입");
        log.info("[OAUTH][UNLINK] provider={}", provider);

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("[OAUTH][UNLINK] Authorization header 누락 또는 형식 오류");
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_MISSING);
        }

        String jwtToken = authHeader.substring(7);

        log.info("[OAUTH][UNLINK] JWT 추출 완료");

        oAuthService.unlinkSocial(provider, jwtToken);

        log.info("[OAUTH][UNLINK] 연동 해제 완료");
        return ResponseEntity.ok().build();
    }
}
