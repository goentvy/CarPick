package com.carpick.domain.car.dto.response.cardetailpage;


import lombok.Data;

@Data
public class CarDetailResponseDto {

    private Long carId;
    private  TopCarDetailDto topCarDetailDto;
    private  CarCardSectionDto carCardSectionDto;
    private  CarNoticeDto carNoticeDto;
    private SanitizationDto sanitizationDto;
    private LocationDto locationDto;
    private PriceSummaryDto priceSummary;



}
