package com.carpick.domain.faq.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.carpick.domain.faq.vo.Faq;

@Mapper
public interface FaqMapper {

	//사용자
	
	List<Faq> search(
	@Param("category") String category,
	@Param("keyword") String keyword
	);
	
	//관리자
	
	List<Faq> findAll();
	
	List<Faq> adminSearch(
	@Param("category") String category,
	@Param("keyword") String keyword
	);
	
	Faq findById(@Param ("id") Long id);
	void insert(Faq faq);
	void update(Faq faq);
	void delete(@Param ("id") Long id);
	
}
