package com.carpick.domain.inquiry.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.carpick.domain.inquiry.dto.AdminInquiryDetailResponse;
import com.carpick.domain.inquiry.dto.AdminInquiryPageResponse;
import com.carpick.domain.inquiry.service.InquiryService;
import com.carpick.global.exception.BusinessException;
import com.carpick.global.exception.enums.ErrorCode;

import lombok.RequiredArgsConstructor;


@Controller
@RequestMapping("/admin/inquiry")
@RequiredArgsConstructor
public class AdminInquiryController {

	private final InquiryService inquiryService;
	
	private static final int PAGE_SIZE = 10;
	
	// 목록 + 페이징
	@GetMapping
	public String list(
	    @RequestParam(defaultValue = "0") int page,
	    @RequestParam(required = false) String search,
	    @RequestParam(required = false) String status,
	    @RequestParam(required = false) String category,
	    Model model
	) {
	    AdminInquiryPageResponse inquiryPage =
	        inquiryService.getInquiryPage(page, PAGE_SIZE, search, status, category);

	    model.addAttribute("inquiries", inquiryPage.getInquiries());
	    model.addAttribute("currentPage", inquiryPage.getCurrentPage());
	    model.addAttribute("totalPages", inquiryPage.getTotalPages());
	    model.addAttribute("totalCount", inquiryPage.getTotalCount());
	    
	    model.addAttribute("search", search);
	    model.addAttribute("status", status);
	    model.addAttribute("category", category);

	    return "inquiry";
	}
	
	
	// 상세 페이지
	@GetMapping("/{id}")
	public String detail(@PathVariable Long id, Model model) {
	    AdminInquiryDetailResponse inquiry =
	        inquiryService.getAdminInquiry(id);

	    model.addAttribute("inquiry", inquiry);
	    return "inquiryWrite";
	}
	
	
	// 답변 등록 / 수정
	@PostMapping("/{id}/answer")
	public String answer(
	    @PathVariable Long id,
	    @RequestParam String reply
	) {
	    if (reply == null || reply.trim().isEmpty()) {
	        throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
	    }

	    inquiryService.answerInquiry(id, reply.trim());
	    return "redirect:/admin/inquiry";
	}
	 
	 // 문의 삭제
	 @PostMapping("/{id}/delete")
	 public String delete(@PathVariable Long id) {
	     inquiryService.deleteInquiry(id);
	     return "redirect:/admin/inquiry";
	 }
}