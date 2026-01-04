package com.carpick.domain.inquiry.dto;

import java.time.LocalDateTime;

import com.carpick.domain.inquiry.enums.InquiryStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminInquiryListResponse {

	private Long id;
	private String userEmail;
	private String category;
	private String title;
	private InquiryStatus status;
	private LocalDateTime createdAt;
}
