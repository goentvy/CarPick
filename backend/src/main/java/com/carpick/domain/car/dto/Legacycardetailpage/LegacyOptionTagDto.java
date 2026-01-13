package com.carpick.domain.car.dto.Legacycardetailpage;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LegacyOptionTagDto {
    private String code; // CAR_SEAT, BLACK_BOX
    private String label; // 카시트, 블랙박스

}
