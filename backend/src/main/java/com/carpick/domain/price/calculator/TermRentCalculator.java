package com.carpick.domain.price.calculator;


import com.carpick.common.vo.Period;
import com.carpick.domain.reservation.enums.RentType;

import java.math.BigDecimal;

public interface TermRentCalculator {
    RentType supports();
    BigDecimal calculateTotalAmount(BigDecimal displayUnitPrice, Period period, Integer rentMonths);
    long getBillingDays(Period period, Integer rentMonths);

}
