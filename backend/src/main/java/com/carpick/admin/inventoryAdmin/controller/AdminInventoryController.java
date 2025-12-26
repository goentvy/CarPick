package com.carpick.admin.inventoryAdmin.controller;


import com.carpick.admin.inventoryAdmin.dto.AdminVehicleInventoryDto;
import com.carpick.admin.inventoryAdmin.service.AdminInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/inventory")
public class AdminInventoryController {
    private final AdminInventoryService adminInventoryService;


    // ==================== 1. 전체 목록 조회 ====================
    @GetMapping
    public ResponseEntity<List<AdminVehicleInventoryDto>> getVehicleList() {
        List<AdminVehicleInventoryDto> list = adminInventoryService.getAllVehicles();
        return ResponseEntity.ok(list);
    }


    // ==================== 2. 단건 조회 ====================
    @GetMapping("/{vehicleId}")
    public ResponseEntity<?> getVehicle(@PathVariable Long vehicleId) {

        AdminVehicleInventoryDto dto = adminInventoryService.getVehicleDetail(vehicleId);

        if (dto == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "차량 재고를 찾을 수 없습니다. ID=" + vehicleId);
            return ResponseEntity.ok(result);
        }

        return ResponseEntity.ok(dto);
    }


    // ==================== 3. 등록 ====================
    @PostMapping
    public ResponseEntity<Map<String, Object>> registerVehicle(
            @RequestBody AdminVehicleInventoryDto dto) {

        Map<String, Object> result = new HashMap<>();

        try {
            adminInventoryService.registerVehicle(dto);

            result.put("success", true);
            result.put("message", "차량 재고가 등록되었습니다.");
            result.put("vehicleId", dto.getVehicleId()); // 생성된 PK 반환
        }
        catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }


    // ==================== 4. 수정 ====================
    @PutMapping("/{vehicleId}")
    public ResponseEntity<Map<String, Object>> updateVehicle(
            @PathVariable Long vehicleId,
            @RequestBody AdminVehicleInventoryDto dto) {

        Map<String, Object> result = new HashMap<>();

        try {
            dto.setVehicleId(vehicleId); // pathVariable 강제 주입
            adminInventoryService.modifyVehicle(dto);

            result.put("success", true);
            result.put("message", "차량 재고 정보가 수정되었습니다.");
        }
        catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }


    // ==================== 5. 삭제 (Soft Delete) ====================
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Map<String, Object>> deleteVehicle(
            @PathVariable Long vehicleId) {

        Map<String, Object> result = new HashMap<>();

        try {
            adminInventoryService.removeVehicle(vehicleId);

            result.put("success", true);
            result.put("message", "차량 재고가 삭제되었습니다.");
        }
        catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }


}
