package com.carpick.domain.auth.controller;

import com.carpick.domain.auth.dto.find.FAuthRequest;
import com.carpick.domain.auth.service.FAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class FAuthController {

    private final FAuthService authService;

    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody FAuthRequest.FindId dto) {
        return ResponseEntity.ok(authService.findId(dto));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<String> resetPassword(
            @RequestBody FAuthRequest.ResetPassword dto
    ) {
        String tempPassword = authService.resetPassword(dto);
        return ResponseEntity.ok(tempPassword);
    }
}