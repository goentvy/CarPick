package com.carpick.domain.car.dto.cardetailpage;


import lombok.Data;

import java.util.List;

@Data
public class CarDetailResponseDto {

    private Long carId;
    private TopCarDetailDto topCarDetailDto;
    private CarCardSectionDto carCardSectionDto;


    private LocationDto locationDto;
    private PriceSummaryDto priceSummary;
    private List<CarInfoCardDto> carInfoCardDto;



}
