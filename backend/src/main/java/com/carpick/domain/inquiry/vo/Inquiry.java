package com.carpick.domain.inquiry.vo;

import java.time.LocalDateTime;

import com.carpick.domain.inquiry.enums.InquiryStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Inquiry {

	private Long id;
	private Long userId;
	
	private String category;
	private String title;
	private String content;
	
	private InquiryStatus status;
	private String adminReply;
	
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
}
