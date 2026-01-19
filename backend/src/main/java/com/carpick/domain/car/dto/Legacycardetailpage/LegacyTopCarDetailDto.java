package com.carpick.domain.car.dto.Legacycardetailpage;


import lombok.Data;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

@Data
public class LegacyTopCarDetailDto {
	
    @NotBlank
    private String title; // 차량 전체 이름
    
    @NotBlank
    private String subtitle; // 연식 · 인원 · 연료 타입 요약
    
//	@NotNull
//	@Size(min = 1) -> 이미지가 반드시 1개 이상 들어가야 한다면 주석제거하고 사용가능
    private String mainVideoUrl;
    private  List<LegacyOptionTagDto> legacyOptionTagDtos;
    private String carType; //    차종

}
