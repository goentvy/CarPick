package com.carpick.domain.faq.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.faq.dto.AdminFaqPageResponse;
import com.carpick.domain.faq.dto.AdminFaqRequest;
import com.carpick.domain.faq.dto.FaqResponse;
import com.carpick.domain.faq.enums.FaqCategory;
import com.carpick.domain.faq.mapper.FaqMapper;
import com.carpick.domain.faq.vo.Faq;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FaqService {
	
	private final FaqMapper faqMapper;
	private static final int PAGE_SIZE = 10;
	
	 // 관리자 목록
	public AdminFaqPageResponse getFaqPage(int page) {
	    return getFaqPage(page, null, null);
	}
    
	public AdminFaqPageResponse getFaqPage(int page, String category, String keyword) {

	    List<Faq> all;

	    // category 문자열 → enum 검증
	    FaqCategory faqCategory = FaqCategory.from(category);

	    boolean hasCategory = faqCategory != null;
	    boolean hasKeyword = keyword != null && !keyword.isBlank();

	    if (hasCategory || hasKeyword) {
	        all = faqMapper.adminSearch(
	                faqCategory != null ? faqCategory.getCode() : null,
	                keyword
	        );
	    } else {
	        all = faqMapper.findAll();
	    }

	    int totalCount = all.size();
	    int totalPages = totalCount == 0 ? 1 :
	            (int) Math.ceil((double) totalCount / PAGE_SIZE);

	    if (page < 0) page = 0;
	    if (page >= totalPages) page = totalPages - 1;

	    int start = page * PAGE_SIZE;
	    int end = Math.min(start + PAGE_SIZE, totalCount);

	    List<FaqResponse> responses =
	    	    all.subList(start, end).stream()
	    	        .map(faq -> new FaqResponse(
	    	            faq.getId(),
	    	            FaqCategory.from(faq.getCategory()).getLabel(), // ⭐ 여기서 한글 변환
	    	            faq.getQuestion(),
	    	            faq.getAnswer()
	    	        ))
	    	        .toList();

	    	return new AdminFaqPageResponse(
	    	    responses,
	    	    page,
	    	    totalPages,
	    	    totalCount
	    	);
    }

    public Faq getFaq(Long id) {
        return faqMapper.findById(id);
    }

    @Transactional
    public void save(AdminFaqRequest req) {
        Faq faq = new Faq();
        faq.setCategory(req.getCategory());
        faq.setQuestion(req.getQuestion());
        faq.setAnswer(req.getAnswer());
        faqMapper.insert(faq);
    }

    @Transactional
    public void update(Long id, AdminFaqRequest req) {
        Faq faq = faqMapper.findById(id);
        faq.setCategory(req.getCategory());
        faq.setQuestion(req.getQuestion());
        faq.setAnswer(req.getAnswer());
        faqMapper.update(faq);
    }

    @Transactional
    public void delete(Long id) {
        faqMapper.delete(id);
    }
    
    
    // 사용자 조회
    public List<FaqResponse> getFaq(String category, String keyword) {

        FaqCategory faqCategory = FaqCategory.from(category);

        List<Faq> faq = faqMapper.search(
                faqCategory != null ? faqCategory.getCode() : null,
                keyword
        );

        return faq.stream()
                .map(faqs -> new FaqResponse(
                        faqs.getId(),
                        faqs.getCategory(),
                        faqs.getQuestion(),
                        faqs.getAnswer()
                ))
                .toList();
	}
}
