package com.carpick.domain.price.shortTerm.policy;


import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.price.mapper.PriceMapper;
import com.carpick.domain.price.mapper.PricePolicyMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class ShortPricePolicyReader {
    private final PriceMapper priceMapper;

    public BigDecimal readDailyUnitPrice(Long specId) {
        if (specId == null) {
            throw new IllegalArgumentException("specId가 비어있습니다.");
        }
//기준은 rentType이 아니라 PriceType
        BigDecimal unitPrice =
                priceMapper.selectActiveUnitPriceByPriceType(specId, PriceType.DAILY);

        if (unitPrice == null) {
            throw new IllegalStateException("단기(DAILY) 요금 정책이 존재하지 않습니다. specId=" + specId);
        }
        return unitPrice;
    }


}
