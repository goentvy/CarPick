package com.carpick.domain.car.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum VehicleStatus {
    // 1. 대여 가능 (손님 받을 준비 완료)
    AVAILABLE("대여 가능", "success"),

    // 2. 예약 됨 (아직 차는 주차장에 있음)
    RESERVED("예약 중", "warning"),

    // 3. 대여 중 (손님이 타고 나감)
    RENTED("대여 중", "primary"),

    // 4. 정비/운행불가 (세차, 수리, 사고 등 모든 '이용 불가' 상황)
    MAINTENANCE("정비/점검", "danger");

    private final String description; // 화면 출력용 한글 (예: "대여 가능")
    private final String badgeCss;    // 타임리프용 CSS 클래스 (예: "success")

}
