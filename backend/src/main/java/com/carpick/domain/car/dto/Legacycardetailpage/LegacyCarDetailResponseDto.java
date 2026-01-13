package com.carpick.domain.car.dto.Legacycardetailpage;


import lombok.Data;

import java.util.List;
import java.util.ArrayList;
import com.carpick.domain.member.dto.ReviewResponse;

@Data
public class LegacyCarDetailResponseDto {

    private Long carId;
    private LegacyTopCarDetailDto legacyTopCarDetailDto;
    private LegacyCarCardSectionDto legacyCarCardSectionDto;
    private LegacyLocationDto legacyLocationDto;
    private LegacyPriceSummaryDto priceSummary;
    private List<LegacyCarInfoCardDto> legacyCarInfoCardDto;

    private List<ReviewResponse> reviews = new ArrayList<>();

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }
}
