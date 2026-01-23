package com.carpick.domain.price.longTerm.rent;

import com.carpick.common.vo.Period;
import com.carpick.domain.price.calculator.TermRentCalculator;
import com.carpick.domain.price.longTerm.duration.LongRentDuration;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class LongTermRentCalculator implements TermRentCalculator {

    private final LongRentChargeCalculator longRentChargeCalculator;

    @Override
    public RentType supports() {
        return RentType.LONG;
    }

    @Override
    public BigDecimal calculateTotalAmount(BigDecimal displayUnitPrice, Period period, Integer rentMonths) {

        log.info("[LONG_TERM] calcTotalAmount input: displayUnitPrice={}, rentMonths={}, period={}",
                displayUnitPrice, rentMonths, period);

        if (displayUnitPrice == null) {
            throw new IllegalArgumentException("장기 렌트는 월 단가(displayUnitPrice)가 필수입니다.");
        }
        if (rentMonths == null || rentMonths <= 0) {
            throw new IllegalArgumentException("장기 렌트는 rentMonths가 1 이상이어야 합니다.");
        }

        LongRentDuration duration = new LongRentDuration(rentMonths); // record compact constructor 검증 활용
        log.info("[LONG_TERM] before chargeCalc: monthlyUnitPrice={}, months={}",
                displayUnitPrice, duration.months());
        BigDecimal total = longRentChargeCalculator.calculate(displayUnitPrice, duration);

        log.info("[LONG_TERM] result: totalAmount={}", total);

        return total;
    }

    @Override
    public long getBillingDays(Period period, Integer rentMonths) {
        return 0L;
    }



}
