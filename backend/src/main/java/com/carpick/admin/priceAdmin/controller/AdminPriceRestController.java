package com.carpick.admin.priceAdmin.controller;

import com.carpick.admin.priceAdmin.dto.AdminPriceDto;
import com.carpick.admin.priceAdmin.service.AdminPriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/price")
@Slf4j
public class AdminPriceRestController {

    private final AdminPriceService priceService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> savePrice(@RequestBody AdminPriceDto dto) {
        return executeLogic(
                () -> priceService.savePriceAndDiscount(dto),
                "가격 정보가 정상적으로 저장되었습니다."
        );
    }

    @GetMapping("/{specId}")
    public ResponseEntity<?> getPriceDetail(@PathVariable Long specId) {
        try {
            AdminPriceDto result = priceService.getPriceBySpecId(specId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.warn("❌ 가격 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("❌ 가격 조회 중 시스템 오류", e);
            return ResponseEntity.internalServerError()
                    .body("가격 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }

    // ===== 공통 응답 헬퍼 =====
    private ResponseEntity<Map<String, Object>> executeLogic(Runnable action, String successMessage) {
        Map<String, Object> response = new HashMap<>();
        try {
            action.run();
            response.put("success", true);
            response.put("message", successMessage);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("❌ [입력 오류] {}", e.getMessage());
            response.put("success", false);
            response.put("message", "[입력 오류] " + e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (IllegalStateException e) {
            log.warn("❌ [처리 불가] {}", e.getMessage());
            response.put("success", false);
            response.put("message", "[처리 불가] " + e.getMessage());
            return ResponseEntity.status(409).body(response);

        } catch (Exception e) {
            log.error("❌ [시스템 오류]", e);
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다. 관리자에게 문의해 주세요.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
