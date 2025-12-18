package com.carpick.domain.car.dto.response.cardetailpage;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PriceSummaryDto {
    private BigDecimal estimatedTotalPrice; // 128000
    private String currency;                // "KRW"
}
