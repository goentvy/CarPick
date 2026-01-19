package com.carpick.domain.price.entity;


import com.carpick.domain.price.enums.PriceType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * [가격 정책 엔티티]
 * 단순한 가격(Price)이 아니라, 기간/지점/조건에 따라 변하는 '정책'을 관리합니다.
 * 예: "여름 성수기 강남점 소나타 가격" vs "겨울 비수기 전국 소나타 가격"
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PricePolicy {
    private Long pricePolicyId;
    private Long specId;
    private Long branchId;            // NULL이면 전국

    private PriceType priceType;      // DAILY / MONTHLY

    private BigDecimal basePrice;     // 정가 (할인 전)
    private Integer discountRate;     // 기본 할인율 (0~100)

    private LocalDateTime validFrom;
    private LocalDateTime validTo;

    private Boolean isActive;
    private String useYn;
    private LocalDateTime deletedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
