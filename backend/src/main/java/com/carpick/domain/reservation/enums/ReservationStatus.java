package com.carpick.domain.reservation.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReservationStatus {
    PENDING("예약 대기", "예약 생성 직후 상태 (결제 전 / 임시 저장 단계)"),

    CONFIRMED("예약 확정", "결제 완료로 예약 확정 (차량이 예약됨)"),

    ACTIVE("이용 중", "대여 시작됨 (차량 인도 완료)"),

    COMPLETED("이용 완료", "반납 완료 및 예약 종료"),

    CANCELED("예약 취소", "예약 취소됨 (결제 전/후 모두 가능)"),

    CHANGED("예약 변경", "기존 예약 내용 변경 완료"),

    TERMINATED_FAULT("중도 종료", "업체 과실(차량 고장 등)로 인한 중도 종료");

    private final String description; // UI 표기용 (예: 이용 중)
    private final String detail;      // 상세 설명 (예: 차량 인도 완료...)
}
