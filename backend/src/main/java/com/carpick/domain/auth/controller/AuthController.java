package com.carpick.domain.auth.controller;


import com.carpick.domain.auth.dto.login.LoginRequest;
import com.carpick.domain.auth.dto.login.LoginResponse;
import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.dto.signup.SignupResponse;
import com.carpick.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam("email") String email) {
        // 1. 서비스에서 중복 여부 확인
        boolean isDuplicate = authService.checkEmailDuplicate(email);

        // 2. JSON 형태로 응답하기 위해 Map 생성 ({ "isDuplicate": true/false })
        Map<String, Boolean> response = new HashMap<>();
        response.put("isDuplicate", isDuplicate);

        // 3. 200 OK 상태코드와 함께 반환
        return ResponseEntity.ok(response);
    }
}
