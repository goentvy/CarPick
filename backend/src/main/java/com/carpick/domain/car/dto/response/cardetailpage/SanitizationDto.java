package com.carpick.domain.car.dto.response.cardetailpage;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SanitizationDto {
	
	@NotBlank
    private String title;
	
	@NotBlank
    private String content;
	
    private List<String> imageUrls;
    
}
