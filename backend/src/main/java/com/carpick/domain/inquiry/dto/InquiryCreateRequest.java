package com.carpick.domain.inquiry.dto;

import lombok.Data;

@Data
public class InquiryCreateRequest {
	
	private Long userId;
	private String category;
	private String title;
	private String content;

}
