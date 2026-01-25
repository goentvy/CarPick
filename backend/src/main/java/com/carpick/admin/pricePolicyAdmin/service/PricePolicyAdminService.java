package com.carpick.admin.pricePolicyAdmin.service;

import com.carpick.admin.pricePolicyAdmin.dto.PricePolicyRowDto;
import com.carpick.admin.pricePolicyAdmin.mapper.PricePolicyAdminMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PricePolicyAdminService {

    private final PricePolicyAdminMapper mapper;

    /* =========================
     * 조회
     * ========================= */

    /**
     * 가격 정책 목록 조회 (관리자 표 출력용)
     */
    @Transactional(readOnly = true)
    public List<PricePolicyRowDto> findAll(Long branchId, String priceType) {
        validateBranchId(branchId);
        validatePriceType(priceType);
        return mapper.findAllByBranchAndPriceType(branchId, priceType);
    }

    /**
     * 단건 조회 (ID 기준)
     */
    @Transactional(readOnly = true)
    public PricePolicyRowDto findById(Long pricePolicyId) {
        if (pricePolicyId == null) {
            throw new IllegalArgumentException("pricePolicyId가 비어있습니다.");
        }
        return mapper.findById(pricePolicyId);
    }

    /**
     * 단건 조회 (고유 키 기준)
     */
    @Transactional(readOnly = true)
    public PricePolicyRowDto findByKey(Long branchId, String priceType, Long specId) {
        validateBranchId(branchId);
        validatePriceType(priceType);
        return mapper.findByKey(branchId, priceType, specId);
    }

    /* =========================
     * 자동 보강 (Upsert 지원)
     * ========================= */

    /**
     * 정책이 없으면 기본값으로 생성하고, 있으면 그대로 반환
     * - 차종 추가 시 자동 대응
     */
    private PricePolicyRowDto ensurePolicyExists(Long branchId, String priceType, Long specId) {
        PricePolicyRowDto existing = mapper.findByKey(branchId, priceType, specId);
        if (existing != null) {
            return existing;
        }

        mapper.insertDefault(branchId, priceType, specId);
        return mapper.findByKey(branchId, priceType, specId);
    }

    /* =========================
     * 수정 (Update-Only)
     * ========================= */

    /**
     * 할인율 수정 (없으면 자동 생성 후 수정)
     */
    @Transactional
    public PricePolicyRowDto updateDiscountRate(Long branchId, String priceType, Long specId, Integer discountRate) {
        validateBranchId(branchId);
        validatePriceType(priceType);
        validateDiscountRate(discountRate);

        PricePolicyRowDto policy = ensurePolicyExists(branchId, priceType, specId);
        policy.setDiscountRate(discountRate);
        mapper.update(policy);

        return mapper.findByKey(branchId, priceType, specId);
    }

    /**
     * 인라인 수정 (행 단위 UPDATE)
     * - 기존 방식 유지 (pricePolicyId 기준)
     */
    @Transactional
    public void update(PricePolicyRowDto dto) {
        if (dto == null || dto.getPricePolicyId() == null) {
            throw new IllegalArgumentException("수정할 pricePolicyId가 비어있습니다.");
        }
        validateUpsertDto(dto);
        mapper.update(dto);
    }

    /* =========================
     * 상태 변경
     * ========================= */

    /**
     * 활성화 토글 (없으면 자동 생성 후 토글)
     * - isActive=true: 배타 처리 수행 (지점전체 ↔ 차종별)
     * - isActive=false: 단순 비활성화
     */
    @Transactional
    public PricePolicyRowDto toggleActive(Long branchId, String priceType, Long specId, Boolean isActive) {
        validateBranchId(branchId);
        validatePriceType(priceType);
        if (isActive == null) {
            throw new IllegalArgumentException("isActive가 비어있습니다.");
        }

        PricePolicyRowDto policy = ensurePolicyExists(branchId, priceType, specId);

        // 활성화하는 경우: 배타 처리
        if (Boolean.TRUE.equals(isActive)) {
            if (specId == null) {
                // 지점 전체 정책 ON → 차종별 정책 OFF
                mapper.deactivateSpecPolicies(branchId, priceType);
            } else {
                // 차종별 정책 ON → 지점 전체 정책 OFF
                mapper.deactivateBranchWidePolicies(branchId, priceType);
            }
        }

        mapper.updateActiveStatus(policy.getPricePolicyId(), isActive);
        return mapper.findByKey(branchId, priceType, specId);
    }

    /**
     * 활성화 토글 (pricePolicyId 기준 - 기존 방식)
     */
    @Transactional
    public void toggleActiveById(Long pricePolicyId, Boolean isActive) {
        if (pricePolicyId == null) {
            throw new IllegalArgumentException("pricePolicyId가 비어있습니다.");
        }
        if (isActive == null) {
            throw new IllegalArgumentException("isActive가 비어있습니다.");
        }

        if (Boolean.TRUE.equals(isActive)) {
            PricePolicyRowDto target = mapper.findById(pricePolicyId);
            if (target == null) {
                throw new IllegalArgumentException("대상 정책을 찾을 수 없습니다. id=" + pricePolicyId);
            }

            if (target.getSpecId() == null) {
                mapper.deactivateSpecPolicies(target.getBranchId(), target.getPriceType());
            } else {
                mapper.deactivateBranchWidePolicies(target.getBranchId(), target.getPriceType());
            }
        }

        mapper.updateActiveStatus(pricePolicyId, isActive);
    }

    /**
     * 사용 여부 변경 (Y/N)
     * - N으로 변경 시 활성 상태도 함께 OFF
     */
    @Transactional
    public void updateUseYn(Long pricePolicyId, String useYn) {
        if (pricePolicyId == null) {
            throw new IllegalArgumentException("pricePolicyId가 비어있습니다.");
        }
        if (!"Y".equals(useYn) && !"N".equals(useYn)) {
            throw new IllegalArgumentException("useYn은 Y 또는 N만 가능합니다.");
        }

        mapper.updateUseYn(pricePolicyId, useYn);

        if ("N".equals(useYn)) {
            mapper.updateActiveStatus(pricePolicyId, false);
        }
    }

    /* =========================
     * 삭제
     * ========================= */

    /**
     * 논리 삭제
     */
    @Transactional
    public void softDelete(Long pricePolicyId) {
        if (pricePolicyId == null) {
            throw new IllegalArgumentException("pricePolicyId가 비어있습니다.");
        }
        mapper.softDelete(pricePolicyId);
    }

    /* =========================
     * Validation
     * ========================= */

    private void validateUpsertDto(PricePolicyRowDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("dto가 비어있습니다.");
        }
        validateBranchId(dto.getBranchId());
        validatePriceType(dto.getPriceType());
        validateDiscountRate(dto.getDiscountRate());

        if (dto.getValidFrom() == null) {
            throw new IllegalArgumentException("validFrom(적용 시작일시)이 비어있습니다.");
        }

        if (dto.getValidTo() != null && dto.getValidTo().isBefore(dto.getValidFrom())) {
            throw new IllegalArgumentException("validTo는 validFrom 이후여야 합니다.");
        }

        if (dto.getUseYn() == null) {
            dto.setUseYn("Y");
        }
        if (!"Y".equals(dto.getUseYn()) && !"N".equals(dto.getUseYn())) {
            throw new IllegalArgumentException("useYn은 Y 또는 N만 가능합니다.");
        }

        if (dto.getIsActive() == null) {
            dto.setIsActive(Boolean.TRUE);
        }
    }

    private void validateBranchId(Long branchId) {
        if (branchId == null) {
            throw new IllegalArgumentException("branchId가 비어있습니다.");
        }
    }

    private void validatePriceType(String priceType) {
        if (priceType == null || priceType.isBlank()) {
            throw new IllegalArgumentException("priceType이 비어있습니다.");
        }
        if (!"DAILY".equals(priceType) && !"MONTHLY".equals(priceType)) {
            throw new IllegalArgumentException("priceType은 DAILY 또는 MONTHLY만 가능합니다.");
        }
    }

    private void validateDiscountRate(Integer discountRate) {
        if (discountRate == null || discountRate < 0 || discountRate > 100) {
            throw new IllegalArgumentException("discountRate는 0~100 범위여야 합니다.");
        }
    }
}