package com.carpick.domain.price.common;


//    - 정가(basePrice)에 할인율(discountRate)을 적용해 실제 판매가를 계산한다.
// * - 할인 적용 후 금액을 사용자/결제 기준에 맞게 100원 단위로 절삭한다.
// *
// * 사용 맥락:
// * - 차량별 할인
// * - 이벤트/프로모션 할인
// * - 멤버십 할인
// *
// * 주의:
// * - '정가를 부풀려 보여주기 위한 표시용 할인'에는 사용하지 않는다.
// * - 이 클래스는 실제 결제 금액을 확정하는 용도로만 사용한다.

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PriceApplyDiscount {
    public static BigDecimal apply(BigDecimal basePrice, int discountRate) {
        if (basePrice == null) {
            throw new IllegalArgumentException("basePrice는 null일 수 없습니다.");
        }

        if (discountRate <= 0) {
            // 할인 없음 → 정가 그대로 사용
            return basePrice;
        }

        if (discountRate >= 100) {
            throw new IllegalArgumentException("discountRate는 100 미만이어야 합니다.");
        }

        // 1) 할인율 적용 (정가 × (100 - 할인율)%)
        BigDecimal discounted = basePrice
                .multiply(BigDecimal.valueOf(100 - discountRate))
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);

        // 2) 표시/결제 정책: 100원 단위 절삭
        return discounted
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN)
                .multiply(BigDecimal.valueOf(100));
    }


}
