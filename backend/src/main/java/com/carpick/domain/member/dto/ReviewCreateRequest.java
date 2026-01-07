package com.carpick.domain.member.dto;

import lombok.Data;

@Data
public class ReviewCreateRequest {
    private Long reservationId;
    private String carName;
    private Double rating;
    private String content;
}
