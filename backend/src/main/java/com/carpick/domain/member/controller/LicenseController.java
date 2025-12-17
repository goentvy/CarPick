package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.LicenseDto;
import com.carpick.domain.member.dto.LicenseRegisterDto;
import com.carpick.domain.member.service.LicenseService;
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

    @PostMapping
    public ResponseEntity<LicenseResponse> register(
            @Valid @RequestBody LicenseRegisterDto dto) {
        LicenseDto result = licenseService.register(1L, dto);
        return ResponseEntity.ok(new LicenseResponse(true, result, null));
    }

    @GetMapping("/me")
    public ResponseEntity<LicenseResponse> getMyLicenses() {
        List<LicenseDto> result = licenseService.getMyLicenses(1L);
        return ResponseEntity.ok(new LicenseResponse(true, result, null));
    }

    // ✅ 개별 삭제 추가!
    @DeleteMapping("/{id}")
    public ResponseEntity<LicenseResponse> delete(@PathVariable Long id) {
        licenseService.delete(id);
        return ResponseEntity.ok(new LicenseResponse(true, null, "삭제완료"));
    }

    // ✅ 내부 Response 클래스
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
