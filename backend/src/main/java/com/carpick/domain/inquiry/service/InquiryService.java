package com.carpick.domain.inquiry.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.inquiry.dto.InquiryCreateRequest;
import com.carpick.domain.inquiry.mapper.InquiryMapper;
import com.carpick.domain.inquiry.vo.Inquiry;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryService {
	
	private final InquiryMapper inquiryMapper;
	
	@Transactional
	public void createInquiry(InquiryCreateRequest req) {
	
	Inquiry inquiry = new Inquiry();
	inquiry.setUserId(req.getUserId());
	inquiry.setCategory(req.getCategory());
	inquiry.setTitle(req.getTitle());
	inquiry.setContent(req.getContent());
	
	inquiryMapper.insertInquiry(inquiry);
	}
}
