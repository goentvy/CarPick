package com.carpick.domain.reservation.mypage.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ActorType {
    USER("사용자", "고객이 직접 변경 (웹/앱을 통한 취소, 변경)"),

    ADMIN("관리자", "관리자가 백오피스에서 수동으로 강제 변경"),

    SYSTEM("시스템", "배치 스케줄러나 정책에 의한 자동 변경 (시간 만료 등)");

    private final String description; // UI 표기용 (예: 사용자)
    private final String detail;      // 상세 설명 (로그 확인용)

}
