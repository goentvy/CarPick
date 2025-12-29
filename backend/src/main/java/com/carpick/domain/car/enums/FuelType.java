package com.carpick.domain.car.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum FuelType {
    GASOLINE("가솔린"),   // 휘발유
    DIESEL("디젤"),       // 경유
    LPG("LPG"),
    ELECTRIC("전기"),
    HYBRID("하이브리드"),
    HYDROGEN("수소");

    private final String description;

}
