package com.carpick.domain.coupon.enums;

import lombok.Getter;

@Getter
public enum CouponType {
    FIXED("정액 할인", "금액을 고정값으로 할인합니다. (예: 5,000원 할인)"),
    RATE("정률 할인", "금액을 비율로 할인합니다. (예: 10% 할인)");

    private final String description; // 짧은 설명 (관리자/로그용)
    private final String detail;      // 상세 설명 (QA/기획 설명용)

    CouponType(String description, String detail) {
        this.description = description;
        this.detail = detail;
    }

}
