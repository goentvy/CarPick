package com.carpick.domain.price.longTerm.policy;


import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.price.mapper.PriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class LongPricePolicyReader {
    private final PriceMapper priceMapper;

    public BigDecimal readMonthlyUnitPrice(Long specId) {
        if (specId == null) {
            throw new IllegalArgumentException("specId가 비어있습니다.");
        }

        BigDecimal unitPrice =
                priceMapper.selectActiveUnitPriceByPriceType(specId, PriceType.MONTHLY);

        if (unitPrice == null) {
            throw new IllegalStateException(
                    "장기 렌트 월 요금(PRICE.monthly_price)이 존재하지 않습니다. specId=" + specId
            );
        }

        return unitPrice;
    }
}
