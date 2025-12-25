package com.carpick.admin.carAdmin.controller;


import com.carpick.admin.carAdmin.dto.AdminCarOptionDto;
import com.carpick.admin.carAdmin.dto.AdminCarSpecDto;
import com.carpick.admin.carAdmin.service.AdminCarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/car")
@RequiredArgsConstructor
public class AdminCarController {
    private final AdminCarService adminCarService;

    // ==================== CarSpec ====================

    /**
     * 차종 목록 조회
     */
    @GetMapping("/spec")
    public ResponseEntity<List<AdminCarSpecDto>> getCarSpecList() {
        List<AdminCarSpecDto> list = adminCarService.getCarSpecList();
        return ResponseEntity.ok(list);
    }

    /**
     * 차종 단건 조회
     */
    @GetMapping("/spec/{specId}")
    public ResponseEntity<AdminCarSpecDto> getCarSpecById(@PathVariable Long specId) {
        AdminCarSpecDto dto = adminCarService.getCarSpecById(specId);
        return ResponseEntity.ok(dto);
    }

    /**
     * 차종 등록
     */
    @PostMapping("/spec")
    public ResponseEntity<Map<String, Object>> addCarSpec(@RequestBody AdminCarSpecDto dto) {
        Map<String, Object> result = new HashMap<>();
        try {
            adminCarService.addCarSpec(dto);
            result.put("success", true);
            result.put("message", "차종이 등록되었습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 차종 수정
     */
    @PutMapping("/spec/{specId}")
    public ResponseEntity<Map<String, Object>> updateCarSpec(
            @PathVariable Long specId,
            @RequestBody AdminCarSpecDto dto) {
        Map<String, Object> result = new HashMap<>();
        try {
            dto.setSpecId(specId);
            adminCarService.updateCarSpec(dto);
            result.put("success", true);
            result.put("message", "차종이 수정되었습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 차종 삭제 (Soft Delete)
     */
    @DeleteMapping("/spec/{specId}")
    public ResponseEntity<Map<String, Object>> deleteCarSpec(@PathVariable Long specId) {
        Map<String, Object> result = new HashMap<>();
        try {
            adminCarService.deleteCarSpec(specId);
            result.put("success", true);
            result.put("message", "차종이 삭제되었습니다.");
        } catch (IllegalStateException e) {
            // 참조 체크 실패 (차량이 있어서 삭제 불가)
            result.put("success", false);
            result.put("message", e.getMessage());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "삭제 중 오류가 발생했습니다.");
        }
        return ResponseEntity.ok(result);
    }

    // ==================== CarOption ====================

    /**
     * 특정 차종의 옵션 목록 조회
     */
    @GetMapping("/spec/{specId}/option")
    public ResponseEntity<List<AdminCarOptionDto>> getOptionListBySpecId(@PathVariable Long specId) {
        List<AdminCarOptionDto> list = adminCarService.getOptionListBySpecId(specId);
        return ResponseEntity.ok(list);
    }

    /**
     * 옵션 단건 조회
     */
    @GetMapping("/option/{optionId}")
    public ResponseEntity<AdminCarOptionDto> getOptionById(@PathVariable Long optionId) {
        AdminCarOptionDto dto = adminCarService.getOptionById(optionId);
        return ResponseEntity.ok(dto);
    }

    /**
     * 옵션 등록
     */
    @PostMapping("/option")
    public ResponseEntity<Map<String, Object>> addCarOption(@RequestBody AdminCarOptionDto dto) {
        Map<String, Object> result = new HashMap<>();
        try {
            adminCarService.addCarOption(dto);
            result.put("success", true);
            result.put("message", "옵션이 등록되었습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 옵션 수정
     */
    @PutMapping("/option/{optionId}")
    public ResponseEntity<Map<String, Object>> updateCarOption(
            @PathVariable Long optionId,
            @RequestBody AdminCarOptionDto dto) {
        Map<String, Object> result = new HashMap<>();
        try {
            dto.setOptionId(optionId);
            adminCarService.updateCarOption(dto);
            result.put("success", true);
            result.put("message", "옵션이 수정되었습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 옵션 삭제 (Soft Delete)
     */
    @DeleteMapping("/option/{optionId}")
    public ResponseEntity<Map<String, Object>> deleteCarOption(@PathVariable Long optionId) {
        Map<String, Object> result = new HashMap<>();
        try {
            adminCarService.deleteCarOption(optionId);
            result.put("success", true);
            result.put("message", "옵션이 삭제되었습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "삭제 중 오류가 발생했습니다.");
        }
        return ResponseEntity.ok(result);
    }
}
