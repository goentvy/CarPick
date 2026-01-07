package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.LicenseDto;
import com.carpick.domain.member.dto.LicenseRegisterDto;
import com.carpick.domain.member.service.LicenseService;
import com.carpick.global.security.details.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/licenses")
@RequiredArgsConstructor
public class LicenseController {

    private final LicenseService licenseService;

    @PostMapping
    public ResponseEntity<LicenseResponse<LicenseDto>> register(
            HttpServletRequest request,
            @Valid @RequestBody LicenseRegisterDto dto) {

        Long userId = getCurrentUserId(request);
        LicenseDto result = licenseService.register(userId, dto);
        return ResponseEntity.ok(new LicenseResponse<>(true, result, null));
    }

    @GetMapping("/me")
    public ResponseEntity<LicenseResponse<List<LicenseDto>>> getMyLicenses(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        System.out.println("### LICENSE /me USER_ID = " + userId);
        List<LicenseDto> result = licenseService.getMyLicenses(userId);
        return ResponseEntity.ok(new LicenseResponse<>(true, result, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<LicenseResponse<Void>> delete(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getCurrentUserId(request);
        licenseService.delete(id);
        return ResponseEntity.ok(new LicenseResponse<>(true, null, "삭제완료"));
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        // 1. Prod: JWT → SecurityContext 우선
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                System.out.println("### PROD MODE: JWT userId = " + userDetails.getUserId());
                return userDetails.getUserId();
            }
        } catch (Exception e) {
            // Dev fallback
        }

        // 2. Dev: X-User-Id 헤더 (로그인된 ID만)
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            System.out.println("### DEV MODE: X-User-Id = " + userIdHeader);
            return Long.parseLong(userIdHeader);
        }

        throw new IllegalStateException("로그인된 사용자가 없습니다. (X-User-Id 헤더 또는 JWT 필요)");
    }

    public static class LicenseResponse<T> {
        private final boolean success;
        private final T data;
        private final String message;

        public LicenseResponse(boolean success, T data, String message) {
            this.success = success;
            this.data = data;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public T getData() { return data; }
        public String getMessage() { return message; }
    }
}
