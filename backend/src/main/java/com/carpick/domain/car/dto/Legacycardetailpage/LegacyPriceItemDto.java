package com.carpick.domain.car.dto.Legacycardetailpage;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class LegacyPriceItemDto {
    private String label;              // "기본 대여료", "보험료", "할인"
    private BigDecimal amount;         // +/-
}
