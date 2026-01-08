package com.carpick.admin.carAdmin.controller;

import com.carpick.admin.carAdmin.dto.AdminCarOptionDto;
import com.carpick.admin.carAdmin.service.AdminCarOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 🎛 추가 옵션 관리 API 컨트롤러
 *
 * - 담당 도메인: CAR_OPTION (카시트, 베이비시트, 네비게이션 등 추가 옵션)
 * - 기본 URL: /api/admin/car-option
 *
 * 기능 요약
 * - GET    /api/admin/car-option              : 옵션 목록 조회
 * - GET    /api/admin/car-option/{optionId}   : 옵션 단건 조회
 * - POST   /api/admin/car-option              : 옵션 등록 (삭제 이력 복구 포함)
 * - PUT    /api/admin/car-option/{optionId}   : 옵션 수정
 * - DELETE /api/admin/car-option/{optionId}   : 옵션 삭제 (Soft Delete)
 * - POST   /api/admin/car-option/{optionId}/restore : 옵션 복구
 *
 * 공통 특징
 * - 예외 발생 시 HTTP 상태코드 + JSON 메시지로 응답
 * - 프론트에서 AJAX로 사용하기 좋게 설계
 */
@RestController
@RequestMapping("/api/admin/car-option")
@RequiredArgsConstructor
public class AdminCarOptionController {

    private final AdminCarOptionService optionService;

    /**
     * ✅ 옵션 목록 조회
     * GET /api/admin/car-option
     */
    @GetMapping
    public ResponseEntity<List<AdminCarOptionDto>> getOptionList() {
        List<AdminCarOptionDto> list = optionService.getOptionList();
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ 옵션 단건 조회
     * GET /api/admin/car-option/{optionId}
     */
    @GetMapping("/{optionId}")
    public ResponseEntity<?> getOption(@PathVariable("optionId") Long optionId) {
        try {
            AdminCarOptionDto dto = optionService.getOption(optionId);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException | IllegalStateException e) {
            // 잘못된 ID 또는 존재하지 않는 데이터
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("옵션 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }

    /**
     * ✅ 옵션 등록
     * POST /api/admin/car-option
     *
     * - 이미 삭제된 동일 이름 옵션이 있으면 → 복구 + 최신 값으로 업데이트
     * - 그렇지 않으면 → 신규 등록
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addOption(@RequestBody AdminCarOptionDto dto) {
        return executeLogic(
                () -> optionService.addOption(dto),
                "옵션이 성공적으로 등록되었습니다."
        );
    }

    /**
     * ✅ 옵션 수정
     * PUT /api/admin/car-option/{optionId}
     */
    @PutMapping("/{optionId}")
    public ResponseEntity<Map<String, Object>> updateOption(
            @PathVariable Long optionId,
            @RequestBody AdminCarOptionDto dto
    ) {
        // 경로 변수의 ID를 DTO에 주입 (URL과 body 불일치 방지용 안전장치)
        dto.setOptionId(optionId);

        return executeLogic(
                () -> optionService.updateOption(dto),
                "옵션 정보가 수정되었습니다."
        );
    }

    /**
     * ✅ 옵션 삭제 (Soft Delete)
     * DELETE /api/admin/car-option/{optionId}
     */
    @DeleteMapping("/{optionId}")
    public ResponseEntity<Map<String, Object>> deleteOption(@PathVariable Long optionId) {
        return executeLogic(
                () -> optionService.deleteOption(optionId),
                "옵션이 삭제되었습니다."
        );
    }

    /**
     * ✅ 옵션 복구
     * POST /api/admin/car-option/{optionId}/restore
     *
     * - 논리삭제(use_yn = 'N') 된 옵션을 다시 활성화할 때 사용
     * - 필요 없으면 프론트에서 이 엔드포인트는 호출하지 않아도 됩니다.
     */
    @PostMapping("/{optionId}/restore")
    public ResponseEntity<Map<String, Object>> restoreOption(@PathVariable Long optionId) {
        return executeLogic(
                () -> optionService.restoreOption(optionId),
                "옵션이 복구되었습니다."
        );
    }

    // ==========================================================
    // 🛠 공통 응답 처리 헬퍼 메서드
    // ==========================================================

    /**
     * 서비스 로직 실행 후, 성공/실패 여부를 JSON으로 리턴하는 공통 함수
     *
     * - 성공 시:
     * {
     * "success": true,
     * "message": "..."
     * }
     *
     * - 실패 시:
     * {
     * "success": false,
     * "message": "[입력 오류] ...",
     * }
     *
     * HTTP 상태코드
     * - 200 OK          : 정상 처리
     * - 400 BAD_REQUEST : 잘못된 요청/파라미터 (IllegalArgumentException)
     * - 409 CONFLICT    : 비즈니스 제약으로 인해 처리 불가 (IllegalStateException)
     * - 500 ERROR       : 그 외 서버 내부 오류
     */
    private ResponseEntity<Map<String, Object>> executeLogic(Runnable action, String successMessage) {
        Map<String, Object> response = new HashMap<>();
        try {
            action.run(); // 서비스 메서드 실행
            response.put("success", true);
            response.put("message", successMessage);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 사용자 입력 오류 (필수값 누락, 잘못된 ID 등)
            response.put("success", false);
            response.put("message", "[입력 오류] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (IllegalStateException e) {
            // 처리 불가능한 상태 (이미 삭제됨, 없는 데이터, 비즈니스 제약 위반 등)
            response.put("success", false);
            response.put("message", "[처리 불가] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);

        } catch (Exception e) {
            // 그 외 알 수 없는 서버 오류
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다. 관리자에게 문의해 주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}