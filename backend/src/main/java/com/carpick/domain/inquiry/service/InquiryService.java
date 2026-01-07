package com.carpick.domain.inquiry.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.inquiry.dto.AdminInquiryDetailResponse;
import com.carpick.domain.inquiry.dto.AdminInquiryListResponse;
import com.carpick.domain.inquiry.dto.AdminInquiryPageResponse;
import com.carpick.domain.inquiry.dto.InquiryCreateRequest;
import com.carpick.domain.inquiry.dto.InquiryCreateResponse;
import com.carpick.domain.inquiry.dto.MyPageInquiryResponse;
import com.carpick.domain.inquiry.enums.InquiryStatus;
import com.carpick.domain.inquiry.mapper.InquiryMapper;
import com.carpick.domain.inquiry.vo.Inquiry;
import com.carpick.global.exception.BusinessException;
import com.carpick.global.exception.enums.ErrorCode;

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
		return inquiryMapper.findByUserId(userId).stream().map(MyPageInquiryResponse::from).toList();
	}

	// 관리자 - 문의 목록 + 페이징
	public AdminInquiryPageResponse getInquiryPage(
		    int page,
		    int pageSize,
		    String search
		) {
		    int totalCount =
		        inquiryMapper.countAdminInquiries(search);

		    int totalPages = totalCount == 0 ? 1 :
		        (int) Math.ceil((double) totalCount / pageSize);

		    page = Math.max(0, Math.min(page, totalPages - 1));
		    int offset = page * pageSize;

		    List<AdminInquiryListResponse> inquiries =
		        inquiryMapper.findAdminPage(offset, pageSize, search);

		    return new AdminInquiryPageResponse(
		        inquiries,
		        page,
		        totalPages,
		        totalCount
		    );
		}

	// 관리자 - 문의 상세
	    public AdminInquiryDetailResponse getAdminInquiry(Long id) {
	        return inquiryMapper.findDetailForAdmin(id);
	    }

	// 관리자 - 답변 등록 / 수정
	    @Transactional
	    public void answerInquiry(Long id, String reply) {

	        AdminInquiryDetailResponse inquiry =
	            inquiryMapper.findDetailForAdmin(id);

	        if (inquiry == null) {
	            throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND);
	        }

	        // ✅ 상태는 서버가 결정
	        inquiryMapper.updateAnswer(
	            id,
	            reply,
	            InquiryStatus.ANSWERED
	        );
	    }
	    
	// 관리자 - 문의 삭제
	    public void deleteInquiry(Long id) {
	    	inquiryMapper.deleteById(id);
	    }
}
