package com.carpick.domain.auth.controller;


import com.carpick.domain.auth.dto.login.LoginRequest;
import com.carpick.domain.auth.dto.login.LoginResponse;
import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.dto.signup.SignupResponse;
import com.carpick.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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


}
