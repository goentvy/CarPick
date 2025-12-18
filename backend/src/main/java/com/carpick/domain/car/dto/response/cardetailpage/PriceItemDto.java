package com.carpick.domain.car.dto.response.cardetailpage;


import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PriceItemDto {
    private String label;              // "기본 대여료", "보험료", "할인"
    private BigDecimal amount;         // +/-
}
