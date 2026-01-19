package com.carpick.domain.price.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RentChargeCalculator {

    public BigDecimal calculate(BigDecimal unitPrice, long days, long hours) {
        BigDecimal dayCost = unitPrice.multiply(BigDecimal.valueOf(days));
        if (hours <= 0) return dayCost;

        BigDecimal hourCost = unitPrice
                .multiply(BigDecimal.valueOf(hours))
                .divide(BigDecimal.valueOf(24), 0, RoundingMode.HALF_UP);

        if (hourCost.compareTo(unitPrice) >= 0) {
            return dayCost.add(unitPrice);
        }
        return dayCost.add(hourCost);
    }
}
