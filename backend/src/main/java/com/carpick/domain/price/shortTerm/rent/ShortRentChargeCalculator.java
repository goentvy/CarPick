package com.carpick.domain.price.shortTerm.rent;

import com.carpick.common.vo.Period;
import com.carpick.domain.price.calculator.TermRentCalculator;
import com.carpick.domain.price.shortTerm.duration.ShortRentDuration;
import com.carpick.domain.price.shortTerm.duration.ShortRentDurationFactory;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;


// 단기 렌트 요금 계산기
//[정책]
// * - 시간 단가 = 일일요금 / 24
// * - 시간 요금 = 시간단가 * hoursPart
// * - 시간 요금은 100원 단위까지 버림 (소비자 분쟁 최소화)
// * - 시간 요금이 일일요금을 넘거나 같으면 일일요금으로 캡
// *
// * 주의)
// * - 기간 계산(시작/종료 차이)은 ShortRentDurationFactory 책임
// * - 금액 계산 정책만 여기서 담당

@Service
@RequiredArgsConstructor
public class ShortRentChargeCalculator {


    private static final BigDecimal HOURS_PER_DAY = BigDecimal.valueOf(24);
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    public BigDecimal calculate(BigDecimal dailyUnitPrice, ShortRentDuration duration) {
        if (dailyUnitPrice == null) {
            throw new IllegalArgumentException("일일 단가(unitPrice)가 비어있습니다.");
        }
        if (duration == null) {
            throw new IllegalArgumentException("기간(duration)이 비어있습니다.");
        }

        long days = duration.daysPart();
        long hours = duration.hoursPart();

        // 1) 일 단위 요금
        BigDecimal dayCost = dailyUnitPrice.multiply(BigDecimal.valueOf(days));

        // 2) 시간 단위 요금 (0시간이면 일요금만)
        if (hours <= 0) return dayCost;

        // 시간 단가 = 일일요금 / 24 (소수 유지)
        BigDecimal hourlyUnitPrice = dailyUnitPrice.divide(HOURS_PER_DAY, 10, RoundingMode.DOWN);

        // 시간 요금(원본) = 시간 단가 * hours
        BigDecimal rawHourCost = hourlyUnitPrice.multiply(BigDecimal.valueOf(hours));

        // 100원 단위 버림
        BigDecimal hourCost = rawHourCost
                .divide(HUNDRED, 0, RoundingMode.DOWN)
                .multiply(HUNDRED);

        // 3) 캡: 시간요금이 하루요금 이상이면 하루요금으로
        if (hourCost.compareTo(dailyUnitPrice) >= 0) {
            return dayCost.add(dailyUnitPrice);
        }

        return dayCost.add(hourCost);
    }
}
