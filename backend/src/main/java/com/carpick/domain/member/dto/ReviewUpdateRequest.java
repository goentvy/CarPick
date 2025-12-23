package com.carpick.domain.member.dto;

import lombok.Data;

@Data
public class ReviewUpdateRequest {
    private Double rating;
    private String content;
}
