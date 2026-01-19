package com.carpick.domain.price.enums;


import lombok.Getter;

@Getter
public enum PriceType {
    DAILY("일 단위 요금", "일/시간 단위로 계산되는 일반 렌트 요금"),
    MONTHLY("월 단위 요금", "30일 이상 장기 계약을 기준으로 계산되는 장기 렌트 요금");

    private final String description; // 짧은 설명 (로그/관리자용)
    private final String detail;      // 상세 설명 (기획/QA/화면 설명용)

    PriceType(String description, String detail) {
        this.description = description;
        this.detail = detail;
    }


}
