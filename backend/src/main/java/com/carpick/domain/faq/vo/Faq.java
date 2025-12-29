package com.carpick.domain.faq.vo;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Faq {

	private Long id;
	private String category;
	private String question;
	private String answer;
	
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
