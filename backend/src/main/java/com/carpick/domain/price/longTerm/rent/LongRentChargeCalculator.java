package com.carpick.domain.price.longTerm.rent;

import com.carpick.common.vo.Period;
import com.carpick.domain.price.calculator.TermRentCalculator;
import com.carpick.domain.price.longTerm.duration.LongRentDuration;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class LongRentChargeCalculator  {


//장기 렌트 요금 계산기
// *
// * [역할]
// * - 장기 렌트 요금 = 월 단가 × 계약 개월수
// * - 할인/보험/날짜 계산은 담당하지 않는다.
// * 순수 계산기
// 🔥 단기와 동일하게 "순수 계산기"를 의존성으로 받음


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
