package com.carpick.domain.faq.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.faq.dto.FaqPageResponse;
import com.carpick.domain.faq.service.FaqService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
public class FaqController {
	
	private final FaqService faqService;
	
	 @GetMapping
	 public FaqPageResponse list(
			    @RequestParam(defaultValue = "0") int page,
			    @RequestParam(required = false) String category,
			    @RequestParam(required = false) String keyword
			) {
			    return faqService.getUserFaqPage(page, category, keyword);
			}
	
}