package com.carpick.domain.inquiry.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.ResponseEntity;
import com.carpick.domain.inquiry.dto.MyPageInquiryResponse;
import org.springframework.web.bind.annotation.*;
import com.carpick.domain.inquiry.service.InquiryService;
import com.carpick.global.security.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageInquiryController{

	private final InquiryService inquiryService;
    private final JwtProvider jwtProvider;


    /* @GetMapping("/inquiries") // 지현님 보안상 주석 처리했습니다
	public List<MyPageInquiryResponse> myInquiries(@RequestParam Long userId) {
		return inquiryService.getMyInquiryResponses(userId);
	}*/

    @GetMapping("/inquiries/me")
    public ResponseEntity<List<MyPageInquiryResponse>> getMyInquiries(
            @RequestHeader("Authorization") String authorizationHeader) {

        Long userId = extractUserId(authorizationHeader);
        System.out.println("### INQUIRY /me USER_ID = " + userId);
        List<MyPageInquiryResponse> result = inquiryService.getMyInquiryResponses(userId);
        return ResponseEntity.ok(result);
    }

    private Long extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더가 올바르지 않습니다.");
        }
        String token = authorizationHeader.substring(7);
        return jwtProvider.getUserId(token);
    }

}
