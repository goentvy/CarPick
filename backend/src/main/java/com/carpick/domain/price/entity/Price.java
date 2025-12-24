package com.carpick.domain.price.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Price {
    private Long priceId;                   // 가격 ID (PK)
    private Long carSpecId;                 // 차량 스펙 ID (CAR_SPEC FK)

    private BigDecimal dailyPrice;           // 1일 대여료 (레거시 기준가)
    private BigDecimal price1m;              // 1개월 대여료
    private BigDecimal price3m;              // 3개월 대여료
    private BigDecimal price6m;              // 6개월 대여료

    private LocalDateTime createdAt;          // 생성일시
    private LocalDateTime updatedAt;          // 수정일시



}
