package com.carpick.domain.car.dto.response.cardetailpage;

import lombok.Data;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class TopCarDetailDto {
	
    @NotBlank
    private String title; // 차량 전체 이름
    
    @NotBlank
    private String subtitle; // 연식 · 인원 · 연료 타입 요약
    
//	@NotNull
//	@Size(min = 1) -> 이미지가 반드시 1개 이상 들어가야 한다면 주석제거하고 사용가능
    private List<String> imageUrls; // 상단 슬라이더 이미지

}
