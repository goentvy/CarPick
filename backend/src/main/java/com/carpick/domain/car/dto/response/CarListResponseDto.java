package com.carpick.domain.car.dto.response;

import com.carpick.domain.car.dto.CarListDto;
import lombok.Data;

import java.util.List;

@Data
public class CarListResponseDto {
    private List<CarListDto> cars;
}
