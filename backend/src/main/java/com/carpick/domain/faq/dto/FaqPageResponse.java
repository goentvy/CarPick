package com.carpick.domain.faq.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FaqPageResponse {

	private List<FaqResponse> content;
	private int currentPage;
	private int totalPages;
	private int totalCount;
}
