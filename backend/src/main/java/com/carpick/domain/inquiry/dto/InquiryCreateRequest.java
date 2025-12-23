package com.carpick.domain.inquiry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InquiryCreateRequest {
	
    @NotBlank
    private String category;

    @NotBlank
    private String title;

    @NotBlank
    private String content;

}
