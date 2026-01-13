package com.carpick.domain.car.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CardType {
    FUEL("연료", null, "fuel"),
    YEAR("연식", "년", "year"),
    SEATS("승차 인원", "명", "seats"),
    CAREER("운전 경력", "년 이상", "career"),
    AGE("이용 가능 연령", "세 이상", "age"),
    FUEL_EFF("연비", "km/L", "fuel_eff");

    private final String title;
    private final String unit;
    private final String icon;
}
