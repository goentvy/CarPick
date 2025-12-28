package com.carpick.admin.inventoryAdmin.controller;


import com.carpick.admin.inventoryAdmin.dto.AdminVehicleInventoryDto;
import com.carpick.admin.inventoryAdmin.service.AdminInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 🚗 차량 재고 관리 API 컨트롤러
 *
 * - 담당 도메인: VEHICLE_INVENTORY
 * - 기본 URL: /admin/api/inventory
 *
 * 기능 요약
 *  - GET    /admin/api/inventory              : 재고 목록 조회
 *  - GET    /admin/api/inventory/{vehicleId}  : 재고 단건 조회
 *  - POST   /admin/api/inventory              : 재고 등록 (삭제 이력 복구 포함)
 *  - PUT    /admin/api/inventory/{vehicleId}  : 재고 수정
 *  - DELETE /admin/api/inventory/{vehicleId}  : 재고 삭제 (Soft Delete)
 *  - POST   /admin/api/inventory/{vehicleId}/restore : 재고 복구
 */


@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/inventory")
public class AdminInventoryController {
    private final AdminInventoryService inventoryService;

    /**
     * ✅ 재고 목록 조회
     * GET /admin/api/inventory
     */
    @GetMapping
    public ResponseEntity<List<AdminVehicleInventoryDto>> getVehicleList() {
        List<AdminVehicleInventoryDto> list = inventoryService.getAllVehicles();
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ 재고 단건 조회
     * GET /admin/api/inventory/{vehicleId}
     */
    @GetMapping("/{vehicleId}")
    public ResponseEntity<?> getVehicle(@PathVariable Long vehicleId) {
        try {
            AdminVehicleInventoryDto dto = inventoryService.getVehicleDetail(vehicleId);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("차량 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }

    /**
     * ✅ 재고 등록
     * POST /admin/api/inventory
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> registerVehicle(@RequestBody AdminVehicleInventoryDto dto) {
        return executeLogic(
                () -> inventoryService.registerVehicle(dto),
                "차량 재고가 등록되었습니다."
        );
    }

    /**
     * ✅ 재고 수정
     * PUT /admin/api/inventory/{vehicleId}
     */
    @PutMapping("/{vehicleId}")
    public ResponseEntity<Map<String, Object>> updateVehicle(
            @PathVariable Long vehicleId,
            @RequestBody AdminVehicleInventoryDto dto) {
        dto.setVehicleId(vehicleId);
        return executeLogic(
                () -> inventoryService.modifyVehicle(dto),
                "차량 재고 정보가 수정되었습니다."
        );
    }

    /**
     * ✅ 재고 삭제 (Soft Delete)
     * DELETE /admin/api/inventory/{vehicleId}
     */
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Map<String, Object>> deleteVehicle(@PathVariable Long vehicleId) {
        return executeLogic(
                () -> inventoryService.removeVehicle(vehicleId),
                "차량 재고가 삭제되었습니다."
        );
    }

    /**
     * ✅ 재고 복구
     * POST /admin/api/inventory/{vehicleId}/restore
     */
    @PostMapping("/{vehicleId}/restore")
    public ResponseEntity<Map<String, Object>> restoreVehicle(@PathVariable Long vehicleId) {
        return executeLogic(
                () -> inventoryService.restoreVehicle(vehicleId),
                "차량 재고가 복구되었습니다."
        );
    }

    // ==========================================================
    // 🛠 공통 응답 처리 헬퍼 메서드
    // ==========================================================

    /**
     * 서비스 로직 실행 후, 성공/실패 여부를 JSON으로 리턴하는 공통 함수
     *
     * HTTP 상태코드
     *  - 200 OK          : 정상 처리
     *  - 400 BAD_REQUEST : 잘못된 요청/파라미터 (IllegalArgumentException)
     *  - 409 CONFLICT    : 비즈니스 제약으로 인해 처리 불가 (IllegalStateException)
     *  - 500 ERROR       : 그 외 서버 내부 오류
     */
    private ResponseEntity<Map<String, Object>> executeLogic(Runnable action, String successMessage) {
        Map<String, Object> response = new HashMap<>();
        try {
            action.run();
            response.put("success", true);
            response.put("message", successMessage);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "[입력 오류] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (IllegalStateException e) {
            response.put("success", false);
            response.put("message", "[처리 불가] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다. 관리자에게 문의해 주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


}
