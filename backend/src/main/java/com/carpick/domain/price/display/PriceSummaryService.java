package com.carpick.domain.price.display;

import com.carpick.common.vo.Period;
import com.carpick.domain.price.calculator.TermRentCalculator;
import com.carpick.domain.price.calculator.TermRentCalculatorResolver;
import com.carpick.domain.price.dto.PriceDisplayDTO;
import com.carpick.domain.price.entity.Price;
import com.carpick.domain.price.entity.PricePolicy;
import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.price.mapper.PriceMapper;
import com.carpick.domain.price.discount.DiscountPolicyService;
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
    private final PriceCalculatorService displayCalculator; // 역산/표시 규칙(정가 복원 등)
    private final TermRentCalculatorResolver termRentCalculatorResolver; //  단기/장기 라우팅

    /**
     * [차 목록/차 상세 표시용 가격 산출]
     * - 목적: UI에 표시할 단가/정가(취소선)/할인율/예상총액(기간 있을 때)을 만든다.
     * - 주의: 결제/정산 확정은 "예약 스냅샷 서비스"에서 수행한다.
     */
    @Transactional(readOnly = true)
    public PriceDisplayDTO calculateDisplayPrice(
            Long specId,
            Long branchId,
            Period period,        // 단기(일/시간) 화면에서는 필수, 목록처럼 기간 없으면 null 가능
            RentType rentType,    // null이면 SHORT로 처리
            Integer rentMonths    // 장기 화면에서 필수(1 이상), 단기면 null 가능
    ) {
        // =====================================================
        // [0] Null Guard
        // =====================================================
        RentType safeRentType = (rentType == null) ? RentType.SHORT : rentType;
        PriceType priceType = safeRentType.toPriceType(); // DAILY / MONTHLY

        // =====================================================
        // [1] PRICE 조회 (실제 과금 기준 단가)
        // =====================================================
        Price price = priceMapper.findBySpecId(specId);
        if (price == null) {
            throw new IllegalArgumentException("가격 정보가 없습니다. specId=" + specId);
        }

        // =====================================================
        // [2] 표시 단가 결정 (단기=일 단가, 장기=월 단가)
        // =====================================================
        BigDecimal displayUnitPrice;
        if (safeRentType == RentType.LONG) {
            displayUnitPrice = (price.getMonthlyPrice() != null) ? price.getMonthlyPrice() : BigDecimal.ZERO;
            if (displayUnitPrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("장기 렌트 월 단가가 비어있습니다. specId=" + specId);
            }
        } else {
            displayUnitPrice = price.getDailyPrice();
            if (displayUnitPrice == null || displayUnitPrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("단기 렌트 일 단가가 비어있습니다. specId=" + specId);
            }
        }

        // =====================================================
        // [3] 정책 조회 (표시용 정가/할인율)
        // =====================================================
        PricePolicy policy = discountService.findDiscountPolicy(specId, branchId, priceType);
        int discountRate = discountService.getDiscountRate(policy);

        // =====================================================
        // [4] 정가(취소선) 계산
        //   - policy.basePrice가 있으면 우선 사용
        //   - 없으면 할인율+표시단가로 역산(표시용)
        // =====================================================
        BigDecimal basePrice;
        if (policy != null && policy.getBasePrice() != null) {
            basePrice = policy.getBasePrice();
        } else if (discountRate > 0 && displayUnitPrice.compareTo(BigDecimal.ZERO) > 0) {
            basePrice = displayCalculator.reverseBasePriceFromDiscountedPrice(displayUnitPrice, discountRate);
        } else {
            basePrice = displayUnitPrice;
        }
// =====================================================
// [5-0] RentType별 입력 정책 고정 (선택지 A)
//   - LONG: rentMonths만 신뢰, period는 계산에 사용하지 않음(무시/참고용)
//   - SHORT: period만 신뢰, rentMonths는 무시
// =====================================================
        Period calcPeriod = period;
        Integer calcMonths = rentMonths;

        if (safeRentType == RentType.LONG) {
            // 장기: 계약 단위(개월 수)가 진실
            if (rentMonths == null || rentMonths <= 0) {
                throw new IllegalArgumentException("장기 렌트는 rentMonths가 1 이상이어야 합니다.");
            }
            calcPeriod = null; //  장기는 period 계산에 절대 사용하지 않도록 명시
        } else {
            // 단기: 기간(start/end)이 진실
            if (period == null) {
                throw new IllegalArgumentException("단기 렌트는 period가 필수입니다.");
            }
            calcMonths = null; //  단기는 months 무시
        }

        // =====================================================
        // [5] 총액(estimatedTotalAmount) + 과금일수(rentDays) 계산
        //   - 단기/장기 분기는 Resolver + TermRentCalculator가 담당
        // =====================================================
        TermRentCalculator termCalc = termRentCalculatorResolver.resolve(safeRentType);

        BigDecimal estimatedTotalAmount = termCalc.calculateTotalAmount(displayUnitPrice, calcPeriod, calcMonths);
        long billingDays = termCalc.getBillingDays(calcPeriod, calcMonths);


        // =====================================================
        // [6] DTO 리턴
        // =====================================================
        return PriceDisplayDTO.ofWithPeriod(
                displayUnitPrice,
                basePrice,
                discountRate,
                priceType,
                safeRentType,
                billingDays,
                estimatedTotalAmount
        );
    }

}
