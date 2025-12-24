package com.carpick.domain.insurance.enums;

public enum InsuranceCode {
    NONE("사고 시 고객부담금 전액"),
    STANDARD("사고 시 고객부담금 30만원"),
    FULL("사고 시 고객부담금 면제");

    private final String description;

    InsuranceCode(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

}
