package com.carpick.domain.car.dto.response.cardetailpage;


import lombok.Data;

@Data
public class CarInfoCardDto {

    private String type; // FUEL, YEAR, SEATS, CAREER, AGE, FUEL_EFF
    private String title; // 카드 상단 문구(짧게)
    private String value; // 23~24년식 / 4명 / 만 21세 / 약 12km/L 등 (없으면 null)
    private String unit; // km/L 같은 단위(없으면 null)
    private String icon;  // 프론트 아이콘 키
}
