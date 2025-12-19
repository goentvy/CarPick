package com.carpick.domain.faq.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.carpick.domain.faq.dto.FaqResponse;
import com.carpick.domain.faq.mapper.FaqMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FaqService {
	
	private final FaqMapper faqMapper;
	
	public List<FaqResponse> getFaqs(String category, String keyword) {
		return faqMapper.search(category, keyword);
	}
}
