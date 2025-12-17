package com.carpick.domain.car.dto.response.cardetailpage;


import lombok.Data;

import java.util.List;

@Data
public class TopCarDetailDto {
    private List<String> imageUrls; // 상단 슬라이더 이미지
    private String title; // 차량 전체 이름
    private String subtitle; // 연식 · 인원 · 연료 타입 요약

}
