package com.carpick.domain.price.service;

import com.carpick.common.vo.Period;
import com.carpick.domain.price.dto.PriceDisplayDTO;
import com.carpick.domain.price.entity.Price;
import com.carpick.domain.price.entity.PricePolicy;
import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.price.mapper.PriceMapper;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Slf4j
@RequiredArgsConstructor
public class PriceSummaryService {
    private final PriceMapper priceMapper;
    private final DiscountPolicyService discountService;
    private final PriceCalculatorService calculator;

    /**
     * [견적 산출 메인]
     * 현재 목표: 단기 렌트(SHORT) 완벽 구동
     */
    @Transactional(readOnly = true)
    public PriceDisplayDTO calculateDisplayPrice(
            Long specId,
            Long branchId,
            Period period,
            String couponCode,
            RentType rentType,
            Integer rentMonths // 장기용(나중에 씀)
    ) {
        // =====================================================
        // [0] Null Guard (이 부분이 없어서 에러 발생!)
        // =====================================================
        // createService에서 null을 넘기므로, 여기서 SHORT로 방어해야 함
        RentType safeRentType = (rentType == null) ? RentType.SHORT : rentType;
        // 1) RentType -> PriceType 변환
        PriceType priceType = safeRentType.toPriceType();

        // 2) PRICE 조회
        Price price = priceMapper.findBySpecId(specId);
        if (price == null) {
            throw new IllegalArgumentException("가격 정보가 없습니다. specId=" + specId);
        }

        // 3) 단가 결정 (일단 DAILY만 확실하게)
        BigDecimal displayUnitPrice;
        if (rentType == RentType.LONG) {
            // [나중에 구현] 장기 렌트가 들어오면 일단 0원으로 처리하거나 에러 방지
            // (사용자님 전략: 단기 먼저 완성)
            displayUnitPrice = (price.getMonthlyPrice() != null) ? price.getMonthlyPrice() : BigDecimal.ZERO;
        } else {
            // [단기] Daily Price 사용
            displayUnitPrice = price.getDailyPrice();
        }

        // 4) 정책 조회
        PricePolicy policy = discountService.findDiscountPolicy(specId, branchId, priceType);
        int discountRate = discountService.getDiscountRate(policy);

        // 5) 정가(취소선) 계산
        BigDecimal basePrice;
        if (policy != null && policy.getBasePrice() != null) {
            basePrice = policy.getBasePrice();
        } else if (discountRate > 0 && displayUnitPrice.compareTo(BigDecimal.ZERO) > 0) {
            basePrice = calculator.reverseBasePriceFromDiscountedPrice(displayUnitPrice, discountRate);
        } else {
            basePrice = displayUnitPrice;
        }

        // 6) 총액 계산 (여기가 핵심!)
        BigDecimal totalBeforeCoupon = BigDecimal.ZERO;
        Long rentDaysForDto = 0L;

        if (rentType == RentType.LONG) {
            // [나중에] 장기 렌트 로직은 일단 PASS
            // (URL로 넘어오는 startDate/endDate로 계산할지, rentMonths로 할지 나중에 결정)
            log.info("장기 렌트 요청 들어옴 (구현 예정)");
            throw new IllegalStateException("장기 렌트 가격 계산은 아직 미구현입니다.");
        } else {
            // [단기] 여기가 진짜!
            if (period == null) {
                throw new IllegalArgumentException("단기 렌트는 기간 정보가 필수입니다.");
            }

            long days = period.getRentDays();
            long hours = period.getRentRemainHours();

            totalBeforeCoupon = calculator.calculateTotalAmount(displayUnitPrice, days, hours)
                    .max(displayUnitPrice); // 최소 1일 요금

            rentDaysForDto = period.getRentDaysForBilling();
        }

        // 7) 쿠폰 할인
        BigDecimal couponDiscount = discountService.calculateCouponDiscountAmount(couponCode, totalBeforeCoupon);

        // 8) 최종 금액
        BigDecimal finalTotalAmount = totalBeforeCoupon.subtract(couponDiscount);
        if (finalTotalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalTotalAmount = BigDecimal.ZERO;
        }

        // 9) DTO 리턴 (수정된 DTO 메서드 사용)
        return PriceDisplayDTO.ofWithPeriod(
                displayUnitPrice,
                basePrice,
                discountRate,
                priceType,
                rentType, // [★] 아까 빠졌던 친구 추가 완료
                rentDaysForDto,
                finalTotalAmount
        );
    }

}
