package com.carpick.domain.auth.controller;

import com.carpick.common.dto.CommonResponse;
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
        var result = authService.findId(dto);

        // ✅ 마스킹된 이메일 로그
        System.out.println("CONTROLLER RESPONSE MASKED EMAIL = " + result.getMaskedEmail());

        return ResponseEntity.ok(result);
    }


    // 🚨 [수정된 부분] 비밀번호 찾기 (이메일 발송 버전)
    // 기존 URL ("/password/reset")을 그대로 사용합니다.
    @PostMapping("/password/reset")
    public ResponseEntity<CommonResponse<Void>> resetPassword(
            @RequestBody FAuthRequest.ResetPassword dto
    ) {
        // 서비스에서 메일 발송 로직 실행 (리턴값 없음)
        authService.sendTemporaryPassword(dto);

        // 프론트엔드에는 비밀번호 대신 "성공했다"는 메시지만 보냄 (보안 강화!)
        return ResponseEntity.ok(CommonResponse.success("임시 비밀번호가 이메일로 발송되었습니다."));
    }
}