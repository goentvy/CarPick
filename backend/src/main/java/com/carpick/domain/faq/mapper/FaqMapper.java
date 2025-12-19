package com.carpick.domain.faq.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.carpick.domain.faq.dto.FaqResponse;

@Mapper
public interface FaqMapper {

	List<FaqResponse> search(
	@Param("category") String category,
	@Param("keyword") String keyword
	);
}
