package com.carpick.domain.inquiry.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.inquiry.dto.MyPageInquiryResponse;
import com.carpick.domain.inquiry.service.InquiryService;
import com.carpick.global.security.details.CustomUserDetails;
import com.carpick.global.security.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageInquiryController {

  	private final InquiryService inquiryService;
    private final JwtProvider jwtProvider;

    @GetMapping("/inquiries")
    public List<MyPageInquiryResponse> myInquiries(
         @AuthenticationPrincipal CustomUserDetails user
         ){
    	return inquiryService.getMyInquiryResponses(user.getUserId());
    }
}
