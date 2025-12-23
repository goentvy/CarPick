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
@Transactional(readOnly = true)
public class InquiryService {

	private final InquiryMapper inquiryMapper;

	// 사용자 - 일대일 문의하기
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

	// 사용자 - 마이페이지 문의내역
	public List<MyPageInquiryResponse> getMyInquiryResponses(Long userId) {
		return inquiryMapper.findByUserId(userId)
				.stream()
				.map(MyPageInquiryResponse::from)
				.toList();
	}
	
	// 관리자 - 문의 목록
	public List<Inquiry> getAllInquiries() {
		return inquiryMapper.findAll();
	}
	
	// 관리자 - 문의 상세
	public Inquiry getInquiry(Long id) {
		return inquiryMapper.findById(id);
	}
	
	// 관리자 - 답변 등록 / 수정
	@Transactional
	public void answerInquiry(Long id, String reply, String status) {
		Inquiry inquiry = inquiryMapper.findById(id);
		
		if(inquiry == null) {
			throw new IllegalArgumentException("존재하지 않는 문의입니다.");
		}
	
		inquiryMapper.updateAnswer(id, reply, status);
	}
}

