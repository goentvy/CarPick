package com.carpick.domain.price.shortTerm.rent;


import com.carpick.common.vo.Period;
import com.carpick.domain.price.calculator.TermRentCalculator;
import com.carpick.domain.price.shortTerm.duration.ShortRentDuration;
import com.carpick.domain.price.shortTerm.duration.ShortRentDurationFactory;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;


/**
 * 단기 렌트 "전략(라우팅 대상)" 구현체
 *
 * [역할]
 * - RentType.SHORT 요청을 처리하는 TermRentCalculator 구현체
 * - Period 필수 검증 + ShortRentDuration 생성
 * - 실제 계산은 ShortRentChargeCalculator(순수 계산기)에 위임
 */



@Service
@RequiredArgsConstructor
public class ShortTermRentCalculator  implements TermRentCalculator {

    private final ShortRentChargeCalculator shortRentChargeCalculator;

    @Override
    public RentType supports() {
        return RentType.SHORT;
    }

    @Override
    public BigDecimal calculateTotalAmount(BigDecimal displayUnitPrice, Period period, Integer rentMonths) {
        if (period == null) {
            throw new IllegalArgumentException("단기 렌트는 period가 필수입니다.");
        }

        ShortRentDuration duration =
                ShortRentDurationFactory.from(
                        period.getStartDateTime(),
                        period.getEndDateTime()
                );

        BigDecimal total = shortRentChargeCalculator.calculate(displayUnitPrice, duration);
        return total.max(displayUnitPrice); // 최소 1일 요금
    }

    @Override
    public long getBillingDays(Period period, Integer rentMonths) {
        return (period == null) ? 0L : period.getRentDaysForBilling();
    }

}
