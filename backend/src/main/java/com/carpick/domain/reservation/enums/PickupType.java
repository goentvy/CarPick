package com.carpick.domain.reservation.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PickupType {
//    배달 서비스 하면 의미를 가지는 것
    VISIT("지점 방문", "고객이 예약한 시간에 지점으로 직접 방문하여 인수"),

    DELIVERY("배달 서비스", "직원이 고객이 요청한 장소로 차량을 배달 (추가 요금 발생)");

    private final String description; // UI 표기용 (예: 지점 방문)
    private final String detail;      // 상세 설명

}
