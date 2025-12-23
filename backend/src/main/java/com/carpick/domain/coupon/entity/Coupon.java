package com.carpick.domain.coupon.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    private Long couponId;                   // 쿠폰 ID (PK)

    /* 식별 */
    private String couponCode;               // 쿠폰 코드 (사용자 입력용)
    private String couponName;               // 쿠폰 이름 (오픈기념 10% 등)

    /* 할인 정책 */
    private String discountType;             // 할인 타입 (FIXED / RATE)
    private Integer discountValue;            // 할인 값 (원 또는 %)
    private Integer maxDiscountAmount;        // 최대 할인 금액 (정률일 때만 사용)
    private Integer minOrderAmount;           // 최소 주문 금액 조건

    /* 유효 기간 */
    private LocalDateTime validFrom;          // 쿠폰 사용 시작일
    private LocalDateTime validTo;            // 쿠폰 사용 종료일

    /* 수량 관리 */
    private Integer totalQuantity;            // 발행 총 수량 (NULL = 무제한)
    private Integer usedQuantity;             // 사용된 수량

    /* 상태 */
    private Boolean isActive;                 // 사용 가능 여부

    /* 공통 */
    private LocalDateTime createdAt;           // 생성일시
    private LocalDateTime updatedAt;           // 수정일시


}
