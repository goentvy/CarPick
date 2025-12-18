package com.carpick.domain.car.dto.response.cardetailpage;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CarNoticeDto {
	
	@NotBlank
    private String title;
	
	@NotBlank
    private String content;

}
