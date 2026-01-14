package com.carpick.domain.car.dto.Legacycardetailpage;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LegacyCarInfoCardDto {

	@NotBlank
    private String type; // FUEL, YEAR, SEATS, CAREER, AGE, FUEL_EFF

    @NotBlank
    private String title; // 카드 상단 문구(짧게)

    private String value; // 23~24년식 / 4명 / 만 21세 / 약 12km/L 등 (없으면 null)

    private String unit; // km/L 같은 단위(없으면 null)

    @NotBlank
    private String icon;  // 프론트 아이콘 키
    
}
