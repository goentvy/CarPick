package com.carpick.admin.carAdmin.controller;

import com.carpick.admin.carAdmin.dto.AdminCarSpecDto;
import com.carpick.admin.carAdmin.service.AdminCarSpecService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/car-spec")
public class AdminCarSpecController {
    private final AdminCarSpecService adminCarSpecService;

    /**
     * ✅ 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<AdminCarSpecDto>> getList() {
        List<AdminCarSpecDto> list = adminCarSpecService.getCarSpecList();
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ 단건 조회
     */
    @GetMapping("/{specId}")
    public ResponseEntity<?> getOne(@PathVariable Long specId) {
        try {
            AdminCarSpecDto dto = adminCarSpecService.getCarSpec(specId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * ✅ 신규 등록 (파일 업로드 추가)
     * - @RequestBody 대신 @ModelAttribute 사용
     * - MultipartFile 파라미터 추가
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> add(
            @ModelAttribute AdminCarSpecDto dto,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "rotatableImage", required = false) MultipartFile rotatableImage
    ) {
        // 서비스 메서드에 파일도 함께 전달하도록 수정 필요
        return executeLogic(() -> adminCarSpecService.addCarSpec(dto, mainImage, rotatableImage),
                "차량 스펙이 성공적으로 등록되었습니다.");
    }

    /**
     * ✅ 수정 (파일 업로드 추가)
     * - JS에서 파일 전송을 위해 POST 방식을 사용하므로 @PostMapping으로 변경
     */
    @PostMapping("/{specId}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long specId,
            @ModelAttribute AdminCarSpecDto dto,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "rotatableImage", required = false) MultipartFile rotatableImage
    ) {
        // 경로 변수의 ID를 DTO에 주입
        dto.setSpecId(specId);

        // 서비스 메서드에 파일도 함께 전달하도록 수정 필요
        return executeLogic(() -> adminCarSpecService.updateCarSpec(dto, mainImage, rotatableImage),
                "차량 스펙이 수정되었습니다.");
    }

    /**
     * ✅ 삭제
     */
    @DeleteMapping("/{specId}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long specId) {
        return executeLogic(() -> adminCarSpecService.softDeleteCarSpec(specId), "차량 스펙이 삭제되었습니다.");
    }

    // ==========================================================
    // 🛠 공통 응답 처리 헬퍼 메서드
    // ==========================================================
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
            response.put("message", "서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
