package com.carpick.domain.inquiry.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.inquiry.dto.InquiryCreateRequest;
import com.carpick.domain.inquiry.dto.InquiryCreateResponse;
import com.carpick.domain.inquiry.service.InquiryService;
import com.carpick.global.security.details.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inquiry")
@RequiredArgsConstructor
public class InquiryController {

	private final InquiryService inquiryService;

	@PostMapping
	public InquiryCreateResponse create(
	    @Valid @RequestBody InquiryCreateRequest req,
	    @AuthenticationPrincipal CustomUserDetails user
	) {
	    return inquiryService.createInquiry(req, user.getUserId());
	}

}