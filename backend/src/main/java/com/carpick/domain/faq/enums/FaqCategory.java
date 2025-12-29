package com.carpick.domain.faq.enums;

import java.util.Arrays;

public enum FaqCategory {

    RESERVATION("reservation", "예약 · 결제"),
    USAGE("usage", "대여 · 반납 · 이용"),
    INSURANCE("insurance", "보험 · 사고"),
    SHORT("short", "단기렌트"),
    LONG("long", "장기렌트"),
    ETC("etc", "기타 서비스");

    private final String code;
    private final String label;

    FaqCategory(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    /** DB / 요청으로 들어온 문자열 → enum */
    public static FaqCategory from(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }

        return Arrays.stream(values())
                .filter(c -> c.code.equals(code))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 FAQ 카테고리: " + code));
    }
}
