package com.carpick.domain.inquiry.dto;

import java.time.LocalDateTime;

import com.carpick.domain.inquiry.vo.Inquiry;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPageInquiryResponse {

	private Long id;
	private String category;
	private String title;
	private String content;
	private String status;
	private String adminReply;
	private String createdAt;

	public static MyPageInquiryResponse from(Inquiry inquiry) {
		return new MyPageInquiryResponse(
				inquiry.getId(),
				inquiry.getCategory(),
				inquiry.getTitle(),
				inquiry.getContent(),
				inquiry.getStatus(),
				inquiry.getAdminReply(),
                inquiry.getCreatedAt().toString()
				);
	}
}