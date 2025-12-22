package com.carpick.domain.inquiry.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.inquiry.dto.InquiryCreateRequest;
import com.carpick.domain.inquiry.dto.InquiryCreateResponse;
import com.carpick.domain.inquiry.service.InquiryService;
import com.carpick.global.security.details.CustomUserDetails;
import com.carpick.global.security.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inquiry")
@RequiredArgsConstructor
public class InquiryController {

	private final InquiryService inquiryService;
	private final JwtProvider jwtProvider;

	 @PostMapping
	    public InquiryCreateResponse create(
	            @RequestHeader("Authorization") String authorizationHeader,
	            @RequestBody InquiryCreateRequest req
	    ) {
	        Long userId = extractUserId(authorizationHeader);
	        return inquiryService.createInquiry(req, userId);
	    }

	    private Long extractUserId(String authorizationHeader) {
	        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
	            throw new IllegalArgumentException("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
	        }
	        String token = authorizationHeader.substring(7);
	        return jwtProvider.getUserId(token);
	    }
}
