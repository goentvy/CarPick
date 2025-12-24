package com.carpick.domain.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FaqResponse {
	private Long id;
	private String category;
	private String question;
	private String answer;
}
