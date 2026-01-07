package com.carpick.admin.insuranceAdmin.controller;


import com.carpick.admin.insuranceAdmin.dto.AdminInsuranceDto;
import com.carpick.admin.insuranceAdmin.service.AdminInsuranceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/insurance")
public class AdminInsuranceController {
    private final AdminInsuranceService adminInsuranceService;

    // ==================== 조회 (READ) ====================

    /**
     * 보험 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<AdminInsuranceDto>> getInsuranceList() {
        List<AdminInsuranceDto> list = adminInsuranceService.getInsuranceList();
        return ResponseEntity.ok(list);
    }

    /**
     * 보험 단건 조회
     */
    @GetMapping("/{insuranceId}")
    public ResponseEntity<AdminInsuranceDto> getInsuranceById(@PathVariable Long insuranceId) {
        AdminInsuranceDto dto = adminInsuranceService.getInsuranceById(insuranceId);
        return ResponseEntity.ok(dto);
    }

    // ==================== 수정 (UPDATE) ====================

    /**
     * 보험 수정 (이것만 남깁니다!)
     */
    @PutMapping("/{insuranceId}")
    public ResponseEntity<Map<String, Object>> updateInsurance(
            @PathVariable Long insuranceId,
            @RequestBody AdminInsuranceDto dto) {

        Map<String, Object> result = new HashMap<>();
        try {
            // ID 세팅
            dto.setInsuranceId(insuranceId);

            // 서비스 호출 (안전하게 기존 데이터 조회 후 업데이트함)
            adminInsuranceService.updateInsurance(dto);

            result.put("success", true);
            result.put("message", "보험 옵션이 수정되었습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    // ==================== 삭제됨 (DELETE / POST) ====================
    /*
     * 정책 변경: 보험 종류는 고정(ENUM)이므로 추가/삭제 API를 제공하지 않습니다.
     * 따라서 @PostMapping, @DeleteMapping 메서드는 모두 삭제했습니다.
     */

}
