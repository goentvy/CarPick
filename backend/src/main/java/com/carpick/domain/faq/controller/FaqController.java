package com.carpick.domain.faq.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.faq.dto.FaqResponse;
import com.carpick.domain.faq.service.FaqService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
public class FaqController {
	
	private final FaqService faqservice;
	
	@GetMapping
	public List<FaqResponse>list(
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String keyword
			){
		return faqservice.getFaq(category, keyword);
	}
	
}