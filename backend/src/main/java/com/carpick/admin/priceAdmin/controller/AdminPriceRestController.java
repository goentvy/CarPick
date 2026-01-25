package com.carpick.admin.priceAdmin.controller;


import com.carpick.admin.priceAdmin.dto.AdminPriceDto;
import com.carpick.admin.priceAdmin.service.AdminPriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/price")
@RequiredArgsConstructor
public class AdminPriceRestController {

    private final AdminPriceService priceService;

    // ======================================================
    //  🔎 조회
    // ======================================================


    /**
     * [1] 전체 목록 조회
     * GET /api/admin/price
     */
    @GetMapping
    public ResponseEntity<List<AdminPriceDto>> getPriceList() {
        List<AdminPriceDto> list = priceService.getPriceList();
        return ResponseEntity.ok(list);
    }

    /**
     * [2] 단건 조회
     * GET /api/admin/price/{specId}
     */
    @GetMapping("/{specId}")
    public ResponseEntity<AdminPriceDto> getPriceBySpecId(@PathVariable Long specId) {
        AdminPriceDto dto = priceService.getPriceBySpecId(specId);
        return ResponseEntity.ok(dto);
    }

    // ======================================================
    //  📝 저장 (INSERT / UPDATE)
    // ======================================================

    /**
     * [3] 가격 저장 (신규 등록 / 수정 통합)
     * POST /api/admin/price
     *
     * - priceId == null → INSERT
     * - priceId != null → UPDATE (낙관적 락)
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> savePrice(@RequestBody AdminPriceDto dto) {
        try {
            priceService.savePrice(dto);
            return ResponseEntity.ok(Map.of("success", true, "message", "가격 정보가 저장되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ======================================================
    //  🚨 긴급 비활성화 / 복구
    // ======================================================

    /**
     * [4] 긴급 비활성화 (운영 사고 대응)
     * PATCH /api/admin/price/{priceId}/deactivate
     */
    @PatchMapping("/{priceId}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivatePrice(
            @PathVariable Long priceId,
            @RequestParam Integer version) {
        log.info("[ADMIN][PRICE] deactivate request priceId={}, version={}", priceId, version);

        try {
            priceService.deactivatePrice(priceId, version);
            return ResponseEntity.ok(Map.of("success", true, "message", "가격이 비활성화되었습니다."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * [5] 재활성화 (복구)
     * PATCH /api/admin/price/{priceId}/activate
     */
    @PatchMapping("/{priceId}/activate")
    public ResponseEntity<Map<String, Object>> activatePrice(
            @PathVariable Long priceId,
            @RequestParam Integer version) {
        log.info("[ADMIN][PRICE] activate request priceId={}, version={}", priceId, version);

        try {
            priceService.activatePrice(priceId, version);
            return ResponseEntity.ok(Map.of("success", true, "message", "가격이 활성화되었습니다."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}

