package com.carpick.dto.response;

import com.carpick.dto.CarListDto;
import lombok.Data;

import java.util.List;

@Data
public class CarListResponseDto {

    private List<CarListDto> cars;
}
