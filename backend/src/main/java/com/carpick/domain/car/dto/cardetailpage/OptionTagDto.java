package com.carpick.domain.car.dto.cardetailpage;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionTagDto {
    private String code; // CAR_SEAT, BLACK_BOX
    private String label; // 카시트, 블랙박스

}
