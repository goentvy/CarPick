package com.carpick.controller;


import com.carpick.dto.LoginRequest;
import com.carpick.dto.LoginResponse;
import com.carpick.dto.SignupRequest;
import com.carpick.dto.SignupResponse;
import com.carpick.model.User;
import com.carpick.service.AuthService;
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

    // GET 로그인 (테스트)

    @GetMapping("/logintest")
    public LoginResponse loginGet(LoginRequest request) {
        return authService.login(request);
    }


    // POST 회원가입(API 엔드포인트)
    @PostMapping("/signup")
    public SignupResponse signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    // GET 회원가입 (테스트)
    @GetMapping("/signuptest")
    public User signupTest() {
        return authService.getLatestSignupUser();
    }
}
