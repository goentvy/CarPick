package com.carpick.domain.price.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PricePolicy {
    private Long pricePolicyId;             // 가격 정책 ID (PK)

    private Long specId;                    // 차량 스펙 ID (CAR_SPEC FK)
    private Long branchId;                  // 지점 ID (BRANCH FK, NULL이면 전국 공통)

    private String unitType;                // 요금 단위 (DAILY / MONTHLY)
    private Integer basePrice;              // 기준 대여료 (할인 전 원가, 계산 기준값)

    private Integer discountRate;            // 할인율 (%) - MVP용 고정 할인

    private LocalDateTime validFrom;         // 정책 적용 시작일
    private LocalDateTime validTo;           // 정책 적용 종료일 (NULL이면 무기한)

    private Boolean isActive;                // 사용 여부 (현재 적용 중인 정책인지)

    private LocalDateTime createdAt;          // 생성일시
    private LocalDateTime updatedAt;          // 수정일시



}
