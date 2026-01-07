package com.carpick.domain.member.dto;

import lombok.Data;

@Data
public class ReviewResponse {
    private Long id;
    private Long reservationId;
    private Long specId;
    private Long userId;
    private String carName;
    private Double rating;
    private String content;
    private String period;
    private String createdAt;

}
