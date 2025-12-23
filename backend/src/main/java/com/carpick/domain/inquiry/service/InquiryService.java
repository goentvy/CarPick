package com.carpick.domain.inquiry.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.inquiry.dto.InquiryCreateRequest;
import com.carpick.domain.inquiry.dto.InquiryCreateResponse;
import com.carpick.domain.inquiry.dto.MyPageInquiryResponse;
import com.carpick.domain.inquiry.mapper.InquiryMapper;
import com.carpick.domain.inquiry.vo.Inquiry;
import com.carpick.global.security.details.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryService {

	private final InquiryMapper inquiryMapper;

	// 일대일 문의하기
	@Transactional
	public InquiryCreateResponse createInquiry(InquiryCreateRequest req, Long userId) {
		Inquiry inquiry = new Inquiry();
		inquiry.setUserId(userId);
		inquiry.setCategory(req.getCategory());
		inquiry.setTitle(req.getTitle());
		inquiry.setContent(req.getContent());

		inquiryMapper.insertInquiry(inquiry);

		return new InquiryCreateResponse(true, inquiry.getId());
	}

	// 마이페이지 문의내역
	public List<MyPageInquiryResponse> getMyInquiryResponses(Long userId) {
		return inquiryMapper.findByUserId(userId)
				.stream()
				.map(MyPageInquiryResponse::from)
				.toList();
	}
}
