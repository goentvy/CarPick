package com.carpick.domain.auth.controller;

import com.carpick.domain.auth.dto.login.LoginRequest;
import com.carpick.domain.auth.dto.login.LoginResponse;
import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.dto.signup.SignupResponse;
import com.carpick.domain.auth.service.AuthService;
import com.carpick.domain.auth.service.RefreshTokenService;
import com.carpick.global.security.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtProvider jwtProvider;

    /* =====================================================
       ✅ 로그인 — Access + Refresh 발급
       ===================================================== */

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {

        LoginResponse loginResponse = authService.login(request);

        String accessToken = jwtProvider.generateAccessToken(
                loginResponse.getUserId(),
                loginResponse.getRole().name()
        );

        String refreshToken = jwtProvider.generateRefreshToken(
                loginResponse.getUserId()
        );

        refreshTokenService.save(
                loginResponse.getUserId(),
                refreshToken
        );

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .domain(".carpick.p-e.kr")
                .path("/api/auth/refresh")
                .maxAge(Duration.ofDays(14))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // ✅ 프론트가 기대하는 구조로 평탄화
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "accessToken", accessToken,
                        "name", loginResponse.getName(),
                        "email", loginResponse.getEmail(),
                        "membershipGrade", loginResponse.getMembershipGrade(),
                        "role", loginResponse.getRole()
                )
        );
    }

    /* =====================================================
       ✅ Access Token 재발급
       ===================================================== */

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {

        String refreshToken = jwtProvider.resolveRefreshToken(request);
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        jwtProvider.validateRefreshToken(refreshToken);

        Long userId = jwtProvider.getUserId(refreshToken);

        if (!refreshTokenService.validate(userId, refreshToken)) {
            return ResponseEntity.status(401).build();
        }

        // ✅ 유저 다시 조회해서 권한 가져오기 (확실하고 안전)
        LoginResponse userInfo = authService.loginById(userId);

        String newAccessToken = jwtProvider.generateAccessToken(
                userId,
                userInfo.getRole().name()
        );

        return ResponseEntity.ok(
                Map.of("accessToken", newAccessToken)
        );
    }

    /* =====================================================
       ✅ 회원가입
       ===================================================== */

    @PostMapping("/signup")
    public SignupResponse signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    /* =====================================================
       ✅ 이메일 중복 확인
       ===================================================== */

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(
                Map.of("isDuplicate", authService.checkEmailDuplicate(email))
        );
    }
}
