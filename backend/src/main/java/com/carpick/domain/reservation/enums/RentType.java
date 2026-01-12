package com.carpick.domain.reservation.enums;

public enum RentType {
    SHORT("단기 렌트", "일/시간 단위로 대여하는 일반 렌트 방식"),
    LONG("장기 렌트", "월 단위 계약으로 대여하는 장기 렌트 방식");

    private final String description;
    private final String detail;

    RentType(String description, String detail) {
        this.description = description;
        this.detail = detail;
    }

    public String getDescription() {
        return description;
    }

    public String getDetail() {
        return detail;
    }
}
