package com.carpick.domain.faq.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminFaqDetailResponse {

	private Long id;
	private String category;
	private String question;
	private String answer;
	private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
