package com.carpick.admin.insuranceAdmin.controller;


import com.carpick.admin.insuranceAdmin.dto.AdminInsuranceDto;
import com.carpick.admin.insuranceAdmin.service.AdminInsuranceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/insurance")
public class AdminInsuranceController {
    private final AdminInsuranceService adminInsuranceService;

    // ==================== 조회 ====================

    /**
     * 보험 목록 조회
     * - GET /admin/api/insurance
     */
    @GetMapping
    public ResponseEntity<List<AdminInsuranceDto>> getInsuranceList() {
        List<AdminInsuranceDto> list = adminInsuranceService.getInsuranceList();
        return ResponseEntity.ok(list);
    }

    /**
     * 보험 단건 조회
     * - GET /admin/api/insurance/{insuranceId}
     */
    @GetMapping("/{insuranceId}")
    public ResponseEntity<AdminInsuranceDto> getInsuranceById(
            @PathVariable Long insuranceId) {
        AdminInsuranceDto dto = adminInsuranceService.getInsuranceById(insuranceId);
        return ResponseEntity.ok(dto);
    }

    // ==================== 등록 ====================

    /**
     * 보험 등록
     * - POST /admin/api/insurance
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addInsurance(
            @RequestBody AdminInsuranceDto dto) {


        Map<String, Object> result = new HashMap<>();
        try {
            // [수정] try 블록 안에서만 딱 한 번 실행합니다.
            adminInsuranceService.addInsurance(dto);

            result.put("success", true);
            result.put("message", "보험 옵션이 등록되었습니다.");
        } catch (Exception e) {
            // Service에서 던진 예외를 잡아서 실패 응답을 만듭니다.
            result.put("success", false);
            result.put("message", e.getMessage()); // 예: "보험료는 0원 이상이어야 합니다"
        }
        return ResponseEntity.ok(result);
    }

    // ==================== 수정 ====================

    /**
     * 보험 수정
     * - PUT /admin/api/insurance/{insuranceId}
     */
    @PutMapping("/{insuranceId}")
    public ResponseEntity<Map<String, Object>> updateInsurance(
            @PathVariable Long insuranceId,
            @RequestBody AdminInsuranceDto dto) {



        Map<String, Object> result = new HashMap<>();
        try {
            // [수정] 중복된 ID 세팅 코드를 제거하고 try 안으로 통합했습니다.
            dto.setInsuranceId(insuranceId); // pathVariable의 ID를 DTO에 주입

            adminInsuranceService.updateInsurance(dto);

            result.put("success", true);
            result.put("message", "보험 옵션이 수정되었습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    // ==================== 삭제 ====================

    /**
     * 보험 삭제 (Soft Delete)
     * - DELETE /admin/api/insurance/{insuranceId}
     * - 예약에서 사용 중이면 삭제 불가 (GlobalExceptionHandler가 처리)
     */
    @DeleteMapping("/{insuranceId}")
    public ResponseEntity<Map<String, Object>> deleteInsurance(
            @PathVariable Long insuranceId) {


        Map<String, Object> result = new HashMap<>();
        try {
            // [수정] 중복 호출 제거
            adminInsuranceService.deleteInsurance(insuranceId);

            result.put("success", true);
            result.put("message", "보험 옵션이 삭제되었습니다.");
        } catch (Exception e) {
            // "예약이 있어 삭제할 수 없습니다" 같은 메시지가 담깁니다.
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }


}
