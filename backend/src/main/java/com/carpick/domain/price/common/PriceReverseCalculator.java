package com.carpick.domain.price.common;


import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class PriceReverseCalculator {
    /**
     * [도구] 정가 역산 공식
     * - 입력: 할인 적용된 판매가(discountedPrice), 할인율(discountRate)
     * - 출력: 표시용 정가(basePrice)
     *
     * 공식: basePrice = discountedPrice * 100 / (100 - discountRate)
     * 표시 단위: 100원 단위 올림
     */
    public BigDecimal reverseBasePriceFromDiscountedPrice(BigDecimal discountedPrice, int discountRate) {
        if (discountedPrice == null) {
            throw new IllegalArgumentException("discountedPrice는 null일 수 없습니다.");
        }
        if (discountRate <= 0) {
            // 할인율이 없으면 정가=판매가
            return discountedPrice;
        }
        if (discountRate >= 100) {
            throw new IllegalArgumentException("discountRate는 100 미만이어야 합니다.");
        }

        // 1) 정가 역산 (원 단위 올림)
        BigDecimal basePrice = discountedPrice
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(100 - discountRate), 0, RoundingMode.CEILING);

        // 2) 표시용 100원 단위 올림
        return basePrice
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.CEILING)
                .multiply(BigDecimal.valueOf(100));
    }
}
