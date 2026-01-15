package com.carpick.domain.faq.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminFaqListResponse {

	private Long id;
	private String category;
	private String question;
	private LocalDateTime updatedAt;
}
