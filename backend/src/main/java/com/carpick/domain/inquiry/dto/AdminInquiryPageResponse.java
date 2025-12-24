package com.carpick.domain.inquiry.dto;

import java.util.List;

import com.carpick.domain.inquiry.vo.Inquiry;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminInquiryPageResponse {

	private List<Inquiry> inquiries;
	private int currentPage;
	private int totalPages;
	private int totalCount;
}
