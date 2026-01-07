package com.carpick.admin.priceAdmin.service;


import com.carpick.admin.priceAdmin.dto.AdminPriceDto;
import com.carpick.admin.priceAdmin.mapper.AdminPriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminPriceService {
    private final AdminPriceMapper priceMapper;

    // ======================================================
    //  🔎 조회
    // ======================================================

    /** ✅ 전체 목록 조회 (차종별 가격 + 할인율) */
    public List<AdminPriceDto> getPriceList() {
        List<AdminPriceDto> list = priceMapper.selectList();
        if (list != null) {
            list.forEach(this::applyFinalPrices);   // 화면용 final 금액 계산
        }
        return list;
    }

    /** ✅ 단건 조회 (specId 기준) */
    public AdminPriceDto getPriceBySpecId(Long carSpecId) {
        if (carSpecId == null) {
            throw new IllegalArgumentException("carSpecId는 null일 수 없습니다.");
        }

        AdminPriceDto dto = priceMapper.selectBySpecId(carSpecId);
        if (dto == null) {
            throw new IllegalStateException("해당 차종의 가격 정보를 찾을 수 없습니다. (specId=" + carSpecId + ")");
        }

        applyFinalPrices(dto);
        return dto;
    }

    // ======================================================
    //  📝 저장 (INSERT + UPDATE 통합)
    // ======================================================

    /**
     * 📝 가격 + 할인율 저장
     *
     * - PRICE
     *   · priceId == null  → insertPrice()
     *   · priceId != null  → updatePrice()
     *
     * - PRICE_POLICY
     *   · discountRate == null → 아무 작업 안함 (할인율 유지)
     *   · discountRate != null && pricePolicyId == null → insertPricePolicy()
     *   · discountRate != null && pricePolicyId != null → updateDiscountRate()
     */
    @Transactional
    public void savePriceAndDiscount(AdminPriceDto dto) {
        validateForSave(dto);

        // -------------------------
        // 1) PRICE 처리 (기본 가격)
        // -------------------------
        if (dto.getPriceId() == null) {
            // 신규 등록
            int inserted = priceMapper.insertPrice(dto);
            if (inserted == 0 || dto.getPriceId() == null) {
                throw new IllegalStateException("가격 정보를 신규 등록하지 못했습니다.");
            }
        } else {
            // 수정 version 조건 불일치 시 update count = 0
            int updated = priceMapper.updatePriceWithVersion(dto);
            if (updated == 0) {
                throw new IllegalStateException(
                        "이미 다른 관리자가 먼저 수정했습니다.\n" +
                                "화면을 새로고침한 뒤 다시 시도해주세요."
                );
            }
        }

        // -------------------------
        // 2) PRICE_POLICY 처리 (할인율)
        // -------------------------
        // 할인율이 null이면 정책은 건드리지 않음 (그대로 유지)
        if (dto.getDiscountRate() == null) {
            return;
        }

        validateDiscountRate(dto.getDiscountRate());

        if (dto.getPricePolicyId() == null) {
            // 정책이 없으면 새로 생성
            int insertedPolicy = priceMapper.insertPricePolicy(dto);
            if (insertedPolicy == 0 || dto.getPricePolicyId() == null) {
                throw new IllegalStateException("할인 정책을 신규 등록하지 못했습니다.");
            }
        } else {
            // 정책 수정
            int updatedPolicy = priceMapper.updateDiscountRate(dto);
            if (updatedPolicy == 0) {
                throw new IllegalStateException(
                        "할인 정책을 수정할 수 없습니다. (pricePolicyId=" + dto.getPricePolicyId() + ")"
                );
            }
        }
    }

    // ======================================================
    //  🔐 내부 검증 / 계산 로직
    // ======================================================

    /** 저장/수정 공통 검증 */
    private void validateForSave(AdminPriceDto dto) {
        if (dto.getCarSpecId() == null) {
            throw new IllegalArgumentException("carSpecId(차량 스펙 ID)는 필수입니다.");
        }

        // 가격이 넘어오면 0 이상인지 체크 (null이면 그대로 허용)
        if (dto.getDailyPrice() != null && isNegative(dto.getDailyPrice())) {
            throw new IllegalArgumentException("1일 대여료는 0 이상이어야 합니다.");
        }
        if (dto.getMonthlyPrice() != null && isNegative(dto.getMonthlyPrice())) {
            throw new IllegalArgumentException("1개월 대여료는 0 이상이어야 합니다.");
        }


        if (dto.getDiscountRate() != null) {
            validateDiscountRate(dto.getDiscountRate());
        }
    }

    /** 할인율 범위 체크 */
    private void validateDiscountRate(Integer discountRate) {
        if (discountRate < 0 || discountRate > 100) {
            throw new IllegalArgumentException("할인율은 0~100 사이 값이어야 합니다.");
        }
    }

    private boolean isNegative(BigDecimal v) {
        return v != null && v.compareTo(BigDecimal.ZERO) < 0;
    }

    // ======================================================
    //  💰 할인 적용 금액 계산 (DB에는 저장 안함)
    // ======================================================

    /**
     * DTO 안의 finalDailyPrice / finalPrice1m
     * 필드를 채워주는 메서드입니다.
     */
    private void applyFinalPrices(AdminPriceDto dto) {
        if (dto == null) return;

        Integer discountRate = dto.getDiscountRate();
        BigDecimal factor = BigDecimal.ONE;

        if (discountRate != null && discountRate > 0) {
            // (100 - 할인율) / 100 (소수점 4자리까지 계산 후 다시 반올림)
            factor = BigDecimal.valueOf(100 - discountRate)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        }

        // 1일 요금
        if (dto.getDailyPrice() != null) {
            dto.setFinalDailyPrice(
                    dto.getDailyPrice()
                            .multiply(factor)
                            .setScale(0, RoundingMode.HALF_UP)   // 필요하면 2로 바꿔서 2자리 소수 유지 가능
            );
        }

        // 1개월
        if (dto.getMonthlyPrice() != null) {
            dto.setFinalMonthlyPrice(
                    dto.getMonthlyPrice()
                            .multiply(factor)
                            .setScale(0, RoundingMode.HALF_UP)
            );
        }


    }


}
