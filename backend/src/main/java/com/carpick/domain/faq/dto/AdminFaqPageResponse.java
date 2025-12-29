package com.carpick.domain.faq.dto;

import java.util.List;

import com.carpick.domain.faq.vo.Faq;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminFaqPageResponse {

	private List<FaqResponse> faqs;
	private int currentPage;
	private int totalPages;
	private int totalCount;
}
