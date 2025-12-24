package com.carpick.domain.car.dto.cardetailpage;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PriceSummaryDto {
    private BigDecimal originalPrice;      // ✅ 원가 추가
    private BigDecimal dailyPrice; // 할인 적용가
    private Integer discountRate;          // ✅ 할인율 추가
    private String currency;                // "KRW"
}
