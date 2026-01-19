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
    private Long priceId;
    private Long carSpecId;

    private BigDecimal dailyPrice;    // 일일 판매가
    private BigDecimal monthlyPrice;  // 월간 판매가

    private String useYn;
    private LocalDateTime deletedAt;
    private Integer version;          // 낙관적 락

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
