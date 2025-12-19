package com.carpick.domain.inquiry.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.inquiry.dto.InquiryCreateRequest;
import com.carpick.domain.inquiry.dto.InquiryCreateResponse;
import com.carpick.domain.inquiry.dto.MyPageInquiryResponse;
import com.carpick.domain.inquiry.mapper.InquiryMapper;
import com.carpick.domain.inquiry.vo.Inquiry;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryService {
	
	private final InquiryMapper inquiryMapper;
	
	// 일대일 문의하기
	@Transactional
	public InquiryCreateResponse createInquiry(InquiryCreateRequest req) {

		Inquiry inquiry = new Inquiry();
		inquiry.setUserId(req.getUserId());
		inquiry.setCategory(req.getCategory());
		inquiry.setTitle(req.getTitle());
		inquiry.setContent(req.getContent());

		inquiryMapper.insertInquiry(inquiry);

		return new InquiryCreateResponse(true, inquiry.getId());
	}
	
	// 마이페이지 문의내역
	public List<MyPageInquiryResponse> getMyInquiryResponses(Long userId) {

		List<Inquiry> inquiries = inquiryMapper.findByUserId(userId);

		return inquiries.stream()
			.map(MyPageInquiryResponse::from)
			.toList();
	}
}
