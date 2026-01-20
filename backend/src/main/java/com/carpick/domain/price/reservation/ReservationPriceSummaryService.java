package com.carpick.domain.price.reservation;


import com.carpick.domain.insurance.enums.InsuranceCode;
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

    private final ShortRentChargeCalculator shortRentChargeCalculator;
    private final ShotrInsuranceCalculatorService shortInsuranceCalculator;

    private final LongRentChargeCalculator longRentChargeCalculator;

    private final DiscountPolicyService discountPolicyService;

    /**
     * 예약 가격 요약 계산 (단기/장기 공용 엔드포인트에서 호출)
     */
    @Transactional(readOnly = true)
    public ReservationPriceSummaryResponseDto calculate(ReservationPriceSummaryRequestDto req) {
        if (req == null) {
            throw new IllegalArgumentException("요청(req)이 비어있습니다.");
        }
        if (req.getSpecId() == null) {
            throw new IllegalArgumentException("specId가 비어있습니다.");
        }

        // rentType이 null로 들어오는 케이스 방어 (기본은 SHORT)
        RentType rentType = (req.getRentType() == null) ? RentType.SHORT : req.getRentType();

        // 보험 코드 null 방어 (기본 NONE)
        InsuranceCode insuranceCode = (req.getInsuranceCode() == null) ? InsuranceCode.NONE : req.getInsuranceCode();

        BigDecimal rentFee;
        BigDecimal insuranceFee;

        if (rentType == RentType.SHORT) {
            // ----------------------------
            // 1) 단기 렌트: 기간 계산
            // ----------------------------
            if (req.getStartDateTime() == null || req.getEndDateTime() == null) {
                throw new IllegalArgumentException("단기 렌트는 startDateTime/endDateTime이 필수입니다.");
            }

            ShortRentDuration duration =
                    ShortRentDurationFactory.from(req.getStartDateTime(), req.getEndDateTime());

            // ----------------------------
            // 2) 단기 렌트: 단가 조회(PRICE.daily_price)
            // ----------------------------
            BigDecimal dailyUnitPrice = shortPricePolicyReader.readDailyUnitPrice(req.getSpecId());

            // ----------------------------
            // 3) 단기 렌트: 대여료 계산
            // ----------------------------
            rentFee = shortRentChargeCalculator.calculate(dailyUnitPrice, duration);

            // ----------------------------
            // 4) 보험료 계산 (단기 보험 계산기 사용)
            // ----------------------------
            insuranceFee = shortInsuranceCalculator.calculate(insuranceCode, duration);

        } else if (rentType == RentType.LONG) {
            // ----------------------------
            // 1) 장기 렌트: months 결정
            // ----------------------------
            // months가 있으면 우선, 없으면 start/end로 계산(fallback)
            LongRentDuration longDuration =
                    LongRentDurationFactory.from(req.getMonths(), req.getStartDateTime(), req.getEndDateTime());

            // ----------------------------
            // 2) 장기 렌트: 월 단가 조회(PRICE.monthly_price)
            // ----------------------------
            BigDecimal monthlyUnitPrice = longPricePolicyReader.readMonthlyUnitPrice(req.getSpecId());

            // ----------------------------
            // 3) 장기 렌트: 대여료 계산
            // ----------------------------
            rentFee = longRentChargeCalculator.calculate(monthlyUnitPrice, longDuration);

            // ----------------------------
            // 4) 보험료 계산 (MVP: 단기 보험 계산기 재사용)
            // ----------------------------
            if (req.getStartDateTime() == null || req.getEndDateTime() == null) {
                throw new IllegalArgumentException("장기 렌트도 보험 계산을 위해 startDateTime/endDateTime이 필요합니다(MVP 정책).");
            }

            ShortRentDuration durationForInsurance =
                    ShortRentDurationFactory.from(req.getStartDateTime(), req.getEndDateTime());

            insuranceFee = shortInsuranceCalculator.calculate(insuranceCode, durationForInsurance);

        } else {
            throw new IllegalArgumentException("지원하지 않는 rentType입니다. rentType=" + rentType);
        }

        // ----------------------------
        // 5) 쿠폰 할인 적용
        // ----------------------------
        // 쿠폰 할인은 "현재 합계(rent + insurance)" 기준으로 계산한다.
        BigDecimal beforeCouponTotal = rentFee.add(insuranceFee);

        BigDecimal couponDiscount =
                discountPolicyService.calculateCouponDiscountAmount(req.getCouponCode(), beforeCouponTotal);

        // ----------------------------
        // 6) 최종 합계
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
