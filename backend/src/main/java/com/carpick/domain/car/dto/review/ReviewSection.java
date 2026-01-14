package com.carpick.domain.car.dto.review;

import com.carpick.domain.member.dto.ReviewResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ReviewSection {
    private List<ReviewResponse> reviews;
    private Integer reviewCount;

}
