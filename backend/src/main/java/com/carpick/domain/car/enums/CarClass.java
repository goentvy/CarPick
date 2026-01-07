package com.carpick.domain.car.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CarClass {
    // 1. 경차/소형
    LIGHT("경형"),
    SMALL("소형"),

    // 2. 세단 라인업
    COMPACT("준중형"),
    MID("중형"),
    LARGE("대형"),

    // 3. 큰 차/레저용
    SUV("SUV"),
    RV("RV/승합"),   // 밴, 카니발 등 포함

    // 4. 기타
    IMPORT("수입");

    private final String description; // 화면 출력용 한글 설명 (예: "경형")

}
