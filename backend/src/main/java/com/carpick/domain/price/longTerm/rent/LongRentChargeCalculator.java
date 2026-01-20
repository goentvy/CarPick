package com.carpick.domain.price.longTerm.rent;

import com.carpick.domain.price.longTerm.duration.LongRentDuration;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LongRentChargeCalculator {
//장기 렌트 요금 계산기
// *
// * [역할]
// * - 장기 렌트 요금 = 월 단가 × 계약 개월수
// * - 할인/보험/날짜 계산은 담당하지 않는다.
// */
public BigDecimal calculate(BigDecimal monthlyUnitPrice, LongRentDuration duration) {
    if (monthlyUnitPrice == null) {
        throw new IllegalArgumentException("월 단가(monthlyUnitPrice)가 비어있습니다.");
    }
    if (duration == null) {
        throw new IllegalArgumentException("장기 렌트 기간(duration)이 비어있습니다.");
    }

    return monthlyUnitPrice.multiply(BigDecimal.valueOf(duration.months()));
}

}
