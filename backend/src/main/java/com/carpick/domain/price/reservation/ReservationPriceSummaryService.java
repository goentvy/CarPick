package com.carpick.domain.price.reservation;


import com.carpick.common.vo.Period;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.price.calculator.TermRentCalculator;
import com.carpick.domain.price.calculator.TermRentCalculatorResolver;
import com.carpick.domain.price.discount.DiscountPolicyService;
import com.carpick.domain.price.dto.ReservationPriceSummaryRequestDto;
import com.carpick.domain.price.dto.ReservationPriceSummaryResponseDto;
import com.carpick.domain.price.longTerm.duration.LongRentDuration;
import com.carpick.domain.price.longTerm.duration.LongRentDurationFactory;
import com.carpick.domain.price.longTerm.policy.LongPricePolicyReader;
import com.carpick.domain.price.longTerm.rent.LongRentChargeCalculator;
import com.carpick.domain.price.shortTerm.duration.ShortRentDuration;
import com.carpick.domain.price.shortTerm.duration.ShortRentDurationFactory;
import com.carpick.domain.price.shortTerm.insurance.ShotrInsuranceCalculatorService;
import com.carpick.domain.price.shortTerm.policy.ShortPricePolicyReader;
import com.carpick.domain.price.shortTerm.rent.ShortRentChargeCalculator;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReservationPriceSummaryService {
//예약 가격 요약(견적) 오케스트레이션 서비스
// *
// * [역할]
// * - 예약 생성 전에 "진짜 결제 금액"을 계산하여 응답 DTO로 반환한다.
// * - 단기/장기 분기, 보험료 포함, 쿠폰 할인, 최종 합계를 한 곳에서 조립한다.
// *
// * [책임 경계]
// * - display(정가/할인율/역산) 로직과 분리한다.
// * - 여기서의 계산 결과는 Reservation 스냅샷 컬럼에 그대로 저장 가능한 값이어야 한다.
// *
// * [MVP 정책]
// * - 장기 할인(이벤트/멤버십)은 미구현
// * - 보험은 단기 보험 계산기를 공통 재사용(발표/데모 우선)
// * - 쿠폰 할인은 DiscountPolicyService 정책을 그대로 사용
private final ShortPricePolicyReader shortPricePolicyReader;
    private final LongPricePolicyReader longPricePolicyReader;

    private final ShotrInsuranceCalculatorService shortInsuranceCalculator;
    private final DiscountPolicyService discountPolicyService;

    //  우리가 만든 라우터(Resolver) 주입
    private final TermRentCalculatorResolver termRentCalculatorResolver;

    /**
     * 예약 가격 요약 계산 (단기/장기 공용)
     *
     * 정책(고정):
     * - SHORT: period(시작/종료) 필수
     * - LONG : months 필수 (period로 개월수 역산하지 않음)
     * - 보험: MVP로 단기 보험 계산기 재사용(기간은 start/end 필요)
     */
    @Transactional(readOnly = true)
    public ReservationPriceSummaryResponseDto calculate(ReservationPriceSummaryRequestDto req) {
        if (req == null) {
            throw new IllegalArgumentException("요청(req)이 비어있습니다.");
        }
        if (req.getSpecId() == null) {
            throw new IllegalArgumentException("specId가 비어있습니다.");
        }

        // rentType null 방어
        RentType rentType = (req.getRentType() == null) ? RentType.SHORT : req.getRentType();

        // 보험코드 null 방어
        InsuranceCode insuranceCode = (req.getInsuranceCode() == null) ? InsuranceCode.NONE : req.getInsuranceCode();

        // ✅ Period는 단기/보험 계산에 필요(장기도 보험 MVP 재사용 때문에 필요)
        if (req.getStartDateTime() == null || req.getEndDateTime() == null) {
            throw new IllegalArgumentException("startDateTime/endDateTime이 비어있습니다.");
        }
        Period period = new Period(req.getStartDateTime(), req.getEndDateTime());

        // ✅ 장기는 months를 반드시 신뢰(선택지 A)
        Integer months = req.getMonths();
        if (rentType == RentType.LONG) {
            if (months == null || months <= 0) {
                throw new IllegalArgumentException("장기 렌트는 months가 1 이상이어야 합니다. months=" + months);
            }
        } else {
            // 단기는 months를 사용하지 않음
            months = null;
        }

        // ----------------------------
        // 1) 단가 조회 (최소 분기 유지)
        // ----------------------------
        BigDecimal unitPrice;
        if (rentType == RentType.LONG) {
            unitPrice = longPricePolicyReader.readMonthlyUnitPrice(req.getSpecId());
        } else {
            unitPrice = shortPricePolicyReader.readDailyUnitPrice(req.getSpecId());
        }
        if (unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("단가(unitPrice)가 비어있습니다. specId=" + req.getSpecId() + ", rentType=" + rentType);
        }

        // ----------------------------
        // 2) 렌트료 계산 (✅ 라우터 사용!)
        // ----------------------------
        TermRentCalculator rentCalculator = termRentCalculatorResolver.resolve(rentType);
        BigDecimal rentFee = rentCalculator.calculateTotalAmount(unitPrice, period, months);

        // ----------------------------
        // 3) 보험료 계산 (MVP: 단기 보험 계산기 재사용)
        // ----------------------------
        ShortRentDuration insuranceDuration =
                ShortRentDurationFactory.from(req.getStartDateTime(), req.getEndDateTime());

        BigDecimal insuranceFee = shortInsuranceCalculator.calculate(insuranceCode, insuranceDuration);

        // ----------------------------
        // 4) 쿠폰 할인
        // ----------------------------
        BigDecimal beforeCouponTotal = rentFee.add(insuranceFee);

        BigDecimal couponDiscount =
                discountPolicyService.calculateCouponDiscountAmount(req.getCouponCode(), beforeCouponTotal);

        // ----------------------------
        // 5) 최종 합계
        // ----------------------------
        BigDecimal totalAmount = beforeCouponTotal.subtract(couponDiscount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        return ReservationPriceSummaryResponseDto.builder()
                .rentFee(rentFee)
                .insuranceFee(insuranceFee)
                .couponDiscount(couponDiscount)
                .totalAmount(totalAmount)
                .build();
    }
}
