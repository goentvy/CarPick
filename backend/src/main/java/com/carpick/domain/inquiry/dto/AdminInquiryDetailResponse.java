package com.carpick.domain.inquiry.dto;

import java.time.LocalDateTime;

import com.carpick.domain.inquiry.enums.InquiryStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class AdminInquiryDetailResponse {
	
	private Long id;
    private String userEmail;
    private String category;
    private String title;
    private String content;
    private InquiryStatus status;
    private String adminReply;
    private LocalDateTime createdAt; 
    private LocalDateTime updatedAt;
}
