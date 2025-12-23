package com.carpick.domain.inquiry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.carpick.domain.inquiry.vo.Inquiry;

@Mapper
public interface InquiryMapper {

	void insertInquiry(Inquiry inquiry);
	
	//마이페이지 문의내역 조회
	List<Inquiry> findByUserId(@Param("userId") Long userId);
}
