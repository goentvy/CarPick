package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.LicenseDto;
import com.carpick.domain.member.dto.LicenseRegisterDto;
import com.carpick.domain.member.service.LicenseService;
import com.carpick.domain.auth.jwt.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/licenses")
@RequiredArgsConstructor
public class LicenseController {

    private final LicenseService licenseService;
    private final JwtProvider jwtProvider;

    // 면허 등록
    @PostMapping
    public ResponseEntity<LicenseResponse<LicenseDto>> register(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody LicenseRegisterDto dto) {

        Long userId = extractUserId(authorizationHeader);
        LicenseDto result = licenseService.register(userId, dto);
        return ResponseEntity.ok(new LicenseResponse<>(true, result, null));
    }

    // 내 면허 목록 조회
    @GetMapping("/me")
    public ResponseEntity<LicenseResponse<List<LicenseDto>>> getMyLicenses(
            @RequestHeader("Authorization") String authorizationHeader) {

        Long userId = extractUserId(authorizationHeader);
        System.out.println("### LICENSE /me USER_ID = " + userId);
        List<LicenseDto> result = licenseService.getMyLicenses(userId);
        return ResponseEntity.ok(new LicenseResponse<>(true, result, null));
    }
    // 면허 단건 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<LicenseResponse<Void>> delete(@PathVariable Long id) {
        licenseService.delete(id);
        return ResponseEntity.ok(new LicenseResponse<>(true, null, "삭제완료"));
    }

    // Authorization 헤더에서 userId 추출
    private Long extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
        }
        String token = authorizationHeader.substring(7); // "Bearer " 이후
        return jwtProvider.getUserId(token);
    }

    // 공통 응답 래퍼
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
