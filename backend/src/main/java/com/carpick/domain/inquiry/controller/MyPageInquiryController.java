package com.carpick.domain.inquiry.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.inquiry.dto.MyPageInquiryResponse;
import com.carpick.domain.inquiry.service.InquiryService;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageInquiryController{

	private final InquiryService inquiryService;
	

	@GetMapping("/inquiries")
	public List<MyPageInquiryResponse> myInquiries(@RequestParam Long userId) {
		return inquiryService.getMyInquiryResponses(userId);
	}
	
}
