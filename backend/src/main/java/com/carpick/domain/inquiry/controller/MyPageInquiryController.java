package com.carpick.domain.inquiry.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.inquiry.dto.MyPageInquiryResponse;
import com.carpick.domain.inquiry.service.InquiryService;
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
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        Long userId = extractUserId(authorizationHeader);
        return inquiryService.getMyInquiryResponses(userId);
    }

    private Long extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
        }
        String token = authorizationHeader.substring(7);
        return jwtProvider.getUserId(token);
    }
}