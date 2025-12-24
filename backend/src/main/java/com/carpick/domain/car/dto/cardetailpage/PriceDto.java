package com.carpick.domain.car.dto.cardetailpage;


import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PriceDto {

    private BigDecimal dailyPrice;     // 1일 요금
    private BigDecimal totalPrice;     // 기간 적용 총액(선택사항)
    private String currency;           // "KRW"
    private String notice;             // "보험 포함/별도" 같은 안내문
    private List<PriceItemDto> items;  // breakdown
}
