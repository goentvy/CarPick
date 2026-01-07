package com.carpick.domain.car.dto.cardetailpage;


import lombok.Data;

import java.util.List;
import java.util.ArrayList;
import com.carpick.domain.member.dto.ReviewResponse;

@Data
public class CarDetailResponseDto {

    private Long carId;
    private TopCarDetailDto topCarDetailDto;
    private CarCardSectionDto carCardSectionDto;
    private LocationDto locationDto;
    private PriceSummaryDto priceSummary;
    private List<CarInfoCardDto> carInfoCardDto;

    private List<ReviewResponse> reviews = new ArrayList<>();

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }
}
