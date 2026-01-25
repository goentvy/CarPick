package com.carpick.admin.pricePolicyAdmin.controller;

import com.carpick.admin.pricePolicyAdmin.dto.PricePolicyRowDto;
import com.carpick.admin.pricePolicyAdmin.service.PricePolicyAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/price-policies")
@RequiredArgsConstructor
public class PricePolicyAdminController {

    private final PricePolicyAdminService service;

    /* =========================
     * 조회
     * ========================= */

    /**
     * 가격 정책 목록 조회
     * - 지점 + 가격단위(DAILY / MONTHLY)
     */
    @GetMapping
    public List<PricePolicyRowDto> findAll(
            @RequestParam Long branchId,
            @RequestParam String priceType
    ) {
        return service.findAll(branchId, priceType);
    }
    @GetMapping("/ping")
    public String ping() {
        return "OK";
    }
    /**
     * 단건 조회 (ID 기준)
     */
    @GetMapping("/{pricePolicyId}")
    public PricePolicyRowDto findById(
            @PathVariable Long pricePolicyId
    ) {
        return service.findById(pricePolicyId);
    }

    /**
     * 단건 조회 (고유 키 기준)
     * - branchId + priceType + specId(NULL 가능)
     */
    @GetMapping("/by-key")
    public PricePolicyRowDto findByKey(
            @RequestParam Long branchId,
            @RequestParam String priceType,
            @RequestParam(required = false) Long specId
    ) {
        return service.findByKey(branchId, priceType, specId);
    }

    /* =========================
     * 수정 (Update-Only)
     * ========================= */

    /**
     * 할인율 수정
     * - row 없으면 자동 생성 후 수정
     * - 인라인 할인율 변경 전용
     */
    @PatchMapping("/discount-rate")
    public PricePolicyRowDto updateDiscountRate(
            @RequestParam Long branchId,
            @RequestParam String priceType,
            @RequestParam(required = false) Long specId,
            @RequestParam Integer discountRate
    ) {
        return service.updateDiscountRate(branchId, priceType, specId, discountRate);
    }

    /**
     * 인라인 수정 (행 단위)
     * - pricePolicyId 기준
     * - 기존 관리자 테이블 방식 유지
     */
    @PutMapping
    public void update(
            @RequestBody PricePolicyRowDto dto
    ) {
        service.update(dto);
    }

    /* =========================
     * 상태 변경
     * ========================= */

    /**
     * 활성화 토글 (고유 키 기준)
     * - row 없으면 자동 생성 후 토글
     */
    @PatchMapping("/active")
    public PricePolicyRowDto toggleActive(
            @RequestParam Long branchId,
            @RequestParam String priceType,
            @RequestParam(required = false) Long specId,
            @RequestParam Boolean isActive
    ) {
        return service.toggleActive(branchId, priceType, specId, isActive);
    }

    /**
     * 활성화 토글 (ID 기준)
     * - 기존 관리자 패턴 유지용
     */
    @PatchMapping("/{pricePolicyId}/active")
    public void toggleActiveById(
            @PathVariable Long pricePolicyId,
            @RequestParam Boolean isActive
    ) {
        service.toggleActiveById(pricePolicyId, isActive);
    }

    /**
     * 사용 여부 변경 (Y/N)
     */
    @PatchMapping("/{pricePolicyId}/use-yn")
    public void updateUseYn(
            @PathVariable Long pricePolicyId,
            @RequestParam String useYn
    ) {
        service.updateUseYn(pricePolicyId, useYn);
    }

    /* =========================
     * 삭제
     * ========================= */

    /**
     * 논리 삭제
     */
    @DeleteMapping("/{pricePolicyId}")
    public void softDelete(
            @PathVariable Long pricePolicyId
    ) {
        service.softDelete(pricePolicyId);
    }
}
