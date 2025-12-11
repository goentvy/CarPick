package com.carpick.controller;


import com.carpick.dto.LoginRequest;
import com.carpick.dto.LoginResponse;
import com.carpick.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // GET 로그인 (테스트)
    // GET /api/auth/login?email=test@test.com&password=1234
    @GetMapping("/login")
    public LoginResponse loginGet(LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/test")
    public String test() {
        return "auth controller working";
    }
}
