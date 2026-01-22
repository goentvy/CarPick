package com.carpick.domain.auth.controller;


import com.carpick.domain.auth.dto.login.LoginRequest;
import com.carpick.domain.auth.dto.login.LoginResponse;
import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.dto.signup.SignupResponse;
import com.carpick.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // POST 로그인(API 엔드포인트)
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }


    // POST 회원가입(API 엔드포인트)
    @PostMapping("/signup")
    public SignupResponse signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(
            @RequestParam("email") String email) {

        log.info("[CHECK-EMAIL] 요청 시작 email={}", email);

        try {
            boolean isDuplicate = authService.checkEmailDuplicate(email);

            Map<String, Boolean> response = new HashMap<>();
            response.put("isDuplicate", isDuplicate);

            log.info("[CHECK-EMAIL] 성공 email={}, isDuplicate={}", email, isDuplicate);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("[CHECK-EMAIL] 실패 email={}", email, e);
            throw e; // 반드시 다시 던져라 (그래야 500 유지)
        }
    }

}
