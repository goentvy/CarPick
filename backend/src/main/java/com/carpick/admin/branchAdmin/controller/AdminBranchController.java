package com.carpick.admin.branchAdmin.controller;


import com.carpick.admin.branchAdmin.dto.AdminBranchDto;
import com.carpick.admin.branchAdmin.service.AdminBranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/branch")
@RequiredArgsConstructor
public class AdminBranchController {

    private final AdminBranchService branchService;

    /**
     * ✅ 지점 목록 조회
     * GET /admin/api/branch
     */
    @GetMapping
    public ResponseEntity<List<AdminBranchDto>> getBranchList() {
        List<AdminBranchDto> list = branchService.getBranchList();
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ 지점 단건 조회
     * GET /admin/api/branch/{branchId}
     */
    @GetMapping("/{branchId}")
    public ResponseEntity<?> getBranch(@PathVariable Long branchId) {
        try {
            AdminBranchDto dto = branchService.getBranch(branchId);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("지점 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }

    /**
     * ✅ 지점 등록
     * POST /admin/api/branch
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addBranch(@RequestBody AdminBranchDto dto) {
        return executeLogic(
                () -> branchService.addBranch(dto),
                "지점이 성공적으로 등록되었습니다."
        );
    }

    /**
     * ✅ 지점 수정
     * PUT /admin/api/branch/{branchId}
     */
    @PutMapping("/{branchId}")
    public ResponseEntity<Map<String, Object>> updateBranch(
            @PathVariable Long branchId,
            @RequestBody AdminBranchDto dto
    ) {
        dto.setBranchId(branchId);
        return executeLogic(
                () -> branchService.updateBranch(dto),
                "지점 정보가 수정되었습니다."
        );
    }

    /**
     * ✅ 지점 삭제 (Soft Delete)
     * DELETE /admin/api/branch/{branchId}
     */
    @DeleteMapping("/{branchId}")
    public ResponseEntity<Map<String, Object>> deleteBranch(@PathVariable Long branchId) {
        return executeLogic(
                () -> branchService.softDeleteBranch(branchId),
                "지점이 삭제되었습니다."
        );
    }

    /**
     * ✅ 지점 복구
     * POST /admin/api/branch/{branchId}/restore
     */
    @PostMapping("/{branchId}/restore")
    public ResponseEntity<Map<String, Object>> restoreBranch(@PathVariable Long branchId) {
        return executeLogic(
                () -> branchService.restoreBranch(branchId),
                "지점이 복구되었습니다."
        );
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
            response.put("message", "서버 오류가 발생했습니다. 관리자에게 문의해 주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
