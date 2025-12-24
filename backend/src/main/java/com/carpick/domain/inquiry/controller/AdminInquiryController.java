package com.carpick.domain.inquiry.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.carpick.domain.inquiry.dto.AdminInquiryPageResponse;
import com.carpick.domain.inquiry.service.InquiryService;
import com.carpick.domain.inquiry.vo.Inquiry;

import lombok.RequiredArgsConstructor;


@Controller
@RequestMapping("/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

	private final InquiryService inquiryService;
	
	private static final int PAGE_SIZE = 10;
	
	// 목록 + 페이징
	 @GetMapping
	    public String list(
	            @RequestParam(defaultValue = "0") int page,
	            Model model) {

	        AdminInquiryPageResponse inquiryPage =
	                inquiryService.getInquiryPage(page, PAGE_SIZE);

	        model.addAttribute("inquiries", inquiryPage.getInquiries());
	        model.addAttribute("currentPage", inquiryPage.getCurrentPage());
	        model.addAttribute("totalPages", inquiryPage.getTotalPages());
	        model.addAttribute("totalCount", inquiryPage.getTotalCount());

	        return "inquiry";
	    }
	
	
	// 상세 페이지
	@GetMapping("/{id}")
	public String detail(
			@PathVariable Long id,
			Model model) {
		Inquiry inquiry = inquiryService.getInquiry(id);
		model.addAttribute("inquiry", inquiry);
		return "inquiryWrite";
	}
	
	
	// 답변 등록 / 수정
	@PostMapping("/{id}/answer")
	public String answer(
			@PathVariable Long id,
			@RequestParam String reply,
			@RequestParam String status
	) {
		inquiryService.answerInquiry(id, reply, status);
		return "redirect:/admin/inquiries";
	}
}