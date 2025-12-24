package com.carpick.domain.inquiry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.carpick.domain.inquiry.vo.Inquiry;

@Mapper
public interface InquiryMapper {

	void insertInquiry(Inquiry inquiry);

	// 사용자 - 마이페이지 문의내역 조회
	List<Inquiry> findByUserId(@Param("userId") Long userId);

	// 관리자 - 목록 조회
	List<Inquiry> findAll();

	// 관리자 - 상세 조회
	Inquiry findById(@Param("id") Long id);

	// 관리자 - 답변 등록 / 수정
	void updateAnswer(
		@Param("id") Long id,
		@Param("adminReply") String adminReply,
		@Param("status") String status
		);
}
