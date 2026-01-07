package com.carpick.domain.member.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewDto {
    private Long id;
    private Long specId;
    private String carName;
    private Double rating;
    private String content;
    private String period;
    private String createdAt;
}