package com.carpick.domain.price.display;

import com.carpick.domain.price.common.PriceApplyDiscount;
import com.carpick.domain.price.common.PriceReverseCalculator;
import com.carpick.domain.price.shortTerm.rent.ShortRentChargeCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class PriceCalculatorService {
//    +차량 상세,  차 목록  총책임자
//    +책임
//   1. 렌트 타입(단기/장기) 라우팅
//    2.공통 정책/표시 규칙의 단일화
//    3.출력 포맷 통일(= 결과 DTO 표준화)
//    +하면 안될것
//    1. 단기 계산 로직(일+시간 요금, 단기 보험료)을 여기서 직접 계산
//    2.장기 계산 로직(월 요금, 장기 보험/프로모션)을 여기서 직접 계산
//    +권장구조
//    1.PriceCalculatorService : 총책임자(라우팅 + 공통표시정책 + 결과표준화)
//    2.ShortTermPriceCalculator : 단기 계산 전담
//    3.LongTermPriceCalculator : 장기 계산 전담



    /**
     * 할인가 단가(discountedUnitPrice)와 할인율(%)로
     * 정가 단가(baseUnitPrice)를 역산한다.
     *
     * 공식:
     *   discounted = base × (1 - rate)
     *   base = discounted / (1 - rate)
     *
     * 정책:
     *  - 할인율 0% → 그대로 반환
     *  - 할인율 100% 이상 → 예외
     *  - 결과는 "원 단위" HALF_UP 반올림
     *
     * 예:
     *  discounted = 10,000
     *  rate = 45
     *  → 10,000 / 0.55 = 18,181.818...
     *  → 18,182
     */
    public BigDecimal reverseBasePriceFromDiscountedPrice(
            BigDecimal discountedUnitPrice,
            int discountRate
    ) {
        if (discountedUnitPrice == null) {
            return BigDecimal.ZERO;
        }

        // 할인 없음
        if (discountRate <= 0) {
            return discountedUnitPrice;
        }

        // 방어
        if (discountRate >= 100) {
            throw new IllegalArgumentException("discountRate는 100 미만이어야 합니다. rate=" + discountRate);
        }

        // 할인율 → 소수 (45% → 0.45)
        BigDecimal rate = BigDecimal.valueOf(discountRate)
                .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);

        // (1 - rate)
        BigDecimal divisor = BigDecimal.ONE.subtract(rate);

        if (divisor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("유효하지 않은 할인율입니다. rate=" + discountRate);
        }

        // 역산 + 원 단위 반올림
        return discountedUnitPrice.divide(divisor, 0, RoundingMode.HALF_UP);
    }
//차량 진짜 할인
    public BigDecimal applyDiscount(BigDecimal basePrice, int discountRate) {
        return PriceApplyDiscount.apply(basePrice, discountRate);
    }


}
