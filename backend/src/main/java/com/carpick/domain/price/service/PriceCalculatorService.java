package com.carpick.domain.price.service;

import com.carpick.domain.insurance.enums.InsuranceCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PriceCalculatorService {
//     계산식 총책임자  역산함수도 있도 이건 차목록에서 사용함
private final RentChargeCalculator rentChargeCalculator;
private final InsuranceCalculatorService insuranceCalculatorService;
    // [호환용] 렌트요금 계산(일+시간) - 내부적으로 RentChargeCalculator에 위임
    public BigDecimal calculateTotalAmount(BigDecimal unitPrice, long days, long hours) {
        return rentChargeCalculator.calculate(unitPrice, days, hours);
    }

    public BigDecimal calculateRentFee(BigDecimal unitPrice, long days, long hours) {
        return rentChargeCalculator.calculate(unitPrice, days, hours);
    }

    public BigDecimal calculateInsuranceFee(InsuranceCode code, LocalDateTime start, LocalDateTime end) {
        return insuranceCalculatorService.calculateInsuranceFee(code, start, end);
    }




    /**
     * 2. 할인 적용 단가 계산
     * - 수정 이유: 123,450원 처럼 10원 단위가 남으면 보기 싫음. (100원 단위 절삭 추천)
     */
    public BigDecimal applyDiscount(BigDecimal basePrice, int discountRate) {
        if (discountRate <= 0) return basePrice;

        // 1) 할인 적용 (원가 * (100-할인율)%)
        BigDecimal discounted = basePrice
                .multiply(BigDecimal.valueOf(100 - discountRate))
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);

        // 2) [옵션] 100원 단위 절삭 (예: 12,340원 -> 12,300원)
        // 실무에서는 보통 이렇게 깔끔하게 맞춤
        return discounted
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN) // 100으로 나누고 소수점 버림 (123)
                .multiply(BigDecimal.valueOf(100)); // 다시 100 곱함 (12300)
//

    }
//     역산 공식 추가 (역산 계산식이고 이걸 사용할지는 PriceSummaryService 에서 결정)
    /**
     * [도구] 정가 역산 공식
     * - 입력: 할인 적용된 판매가(discountedPrice), 할인율(discountRate)
     * - 출력: 표시용 정가(basePrice)
     * - 정책 판단 없음 (언제 쓸지는 PriceSummaryService에서 결정)
     *
     * 공식: basePrice = discountedPrice * 100 / (100 - discountRate)
     * 표시 단위: 100원 단위 올림
     */
    public BigDecimal reverseBasePriceFromDiscountedPrice(
            BigDecimal discountedPrice,
            int discountRate
    ) {
        if (discountedPrice == null) {
            throw new IllegalArgumentException("discountedPrice는 null일 수 없습니다.");
        }
        if (discountRate <= 0) {
            // 할인율이 없으면 정가=판매가로 취급
            return discountedPrice;
        }
        if (discountRate >= 100) {
            throw new IllegalArgumentException("discountRate는 100 미만이어야 합니다.");
        }

        // 1) 정가 역산 (원 단위 올림: 정가가 판매가보다 작아지는 상황 방지)
        BigDecimal basePrice = discountedPrice
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(100 - discountRate), 0, RoundingMode.CEILING);

        // 2) 표시용 100원 단위 올림 (예: 120,301 -> 120,400)
        return basePrice
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.CEILING)
                .multiply(BigDecimal.valueOf(100));
    }

}
