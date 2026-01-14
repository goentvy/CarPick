package com.carpick.domain.inquiry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.carpick.domain.inquiry.dto.AdminInquiryDetailResponse;
import com.carpick.domain.inquiry.dto.AdminInquiryListResponse;
import com.carpick.domain.inquiry.enums.InquiryStatus;
import com.carpick.domain.inquiry.vo.Inquiry;

@Mapper
public interface InquiryMapper {
	// 사용자 - 마이페이지 문의내역 조회
	void insertInquiry(Inquiry inquiry);
	List<Inquiry> findByUserId(@Param("userId") Long userId);

	// 관리자 - 목록 조회
	List<AdminInquiryListResponse> findAdminPage(
		    @Param("offset") int offset,
		    @Param("limit") int limit,
		    @Param("search") String search
		);

		int countAdminInquiries(@Param("search") String search);

	// 관리자 - 상세 조회
	AdminInquiryDetailResponse findDetailForAdmin(@Param("id") Long id);

	// 관리자 - 답변 등록 / 수정
	int updateAnswer(
		    @Param("id") Long id,
		    @Param("adminReply") String adminReply,
		    @Param("status") InquiryStatus status
		);
	
	// 관리자 - 문의 삭제
	int deleteById(@Param("id") Long id);
}
