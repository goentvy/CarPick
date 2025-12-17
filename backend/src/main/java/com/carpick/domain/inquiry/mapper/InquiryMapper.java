package com.carpick.domain.inquiry.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.carpick.domain.inquiry.vo.Inquiry;

@Mapper
public interface InquiryMapper {

	void insertInquiry(Inquiry inquiry);
}
