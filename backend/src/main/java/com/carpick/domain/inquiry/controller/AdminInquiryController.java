package com.carpick.domain.inquiry.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.carpick.domain.inquiry.service.InquiryService;
import com.carpick.domain.inquiry.vo.Inquiry;

import lombok.RequiredArgsConstructor;


@Controller
@RequestMapping("/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

	private final InquiryService inquiryService;
	
	// 목록
	@GetMapping
	public String list(
			@RequestParam(defaultValue = "0") int page,
			Model model) {
		int pageSize = 15;
		List<Inquiry> allInquiries = inquiryService.getAllInquiries();
		
		// 페이징 처리
		int totalCount = allInquiries.size();
		int totalPages = totalCount == 0 ? 1 : (int) Math.ceil((double) totalCount / pageSize);
		
		// 페이지 범위 검증
		if (page < 0) page = 0;
		if (page >= totalPages) page = Math.max(0, totalPages - 1);
		
		int startIndex = page * pageSize;
		int endIndex = Math.min(startIndex + pageSize, totalCount);
		
		List<Inquiry> inquiries = totalCount == 0 ? allInquiries : allInquiries.subList(startIndex, endIndex);
		
		model.addAttribute("inquiries", inquiries);
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("totalCount", totalCount);
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