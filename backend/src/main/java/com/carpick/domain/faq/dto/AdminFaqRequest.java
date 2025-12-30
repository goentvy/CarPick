package com.carpick.domain.faq.dto;

import lombok.Data;

@Data
public class AdminFaqRequest {

	private String category;
	private String question;
	private String answer;
}
