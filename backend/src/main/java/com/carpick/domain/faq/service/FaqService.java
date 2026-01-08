package com.carpick.domain.faq.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.faq.dto.AdminFaqDetailResponse;
import com.carpick.domain.faq.dto.AdminFaqListResponse;
import com.carpick.domain.faq.dto.AdminFaqPageResponse;
import com.carpick.domain.faq.dto.AdminFaqRequest;
import com.carpick.domain.faq.dto.FaqPageResponse;
import com.carpick.domain.faq.dto.FaqResponse;
import com.carpick.domain.faq.enums.FaqCategory;
import com.carpick.domain.faq.mapper.FaqMapper;
import com.carpick.domain.faq.vo.Faq;
import com.carpick.global.exception.BusinessException;
import com.carpick.global.exception.enums.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FaqService {
	
	private final FaqMapper faqMapper;
    private static final int PAGE_SIZE = 10;
    private static final int USER_PAGE_SIZE = 10;

    // ===== 관리자 목록 + 페이징 =====
    public AdminFaqPageResponse getFaqPage(
        int page,
        String category,
        String keyword
    ) {
        FaqCategory faqCategory = FaqCategory.from(category);

        int totalCount = faqMapper.countAdminFaqs(
            faqCategory != null ? faqCategory.getCode() : null,
            keyword
        );

        int totalPages = totalCount == 0 ? 1 :
            (int) Math.ceil((double) totalCount / PAGE_SIZE);

        page = Math.max(0, Math.min(page, totalPages - 1));
        int offset = page * PAGE_SIZE;

        List<AdminFaqListResponse> faqs =
            faqMapper.findAdminPage(
                offset,
                PAGE_SIZE,
                faqCategory != null ? faqCategory.getCode() : null,
                keyword
            );

        return new AdminFaqPageResponse(
            faqs,
            page,
            totalPages,
            totalCount
        );
    }

    // ===== 관리자 상세 =====
    public AdminFaqDetailResponse getAdminFaq(Long id) {
        Faq faq = faqMapper.findById(id);


        if (faq == null) {
            throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND);
        }

        return new AdminFaqDetailResponse(
            faq.getId(),
            faq.getCategory(),
            faq.getQuestion(),
            faq.getAnswer()
        );
    }

    @Transactional
    public void createFaq(AdminFaqRequest req) {
        Faq faq = new Faq();
        faq.setCategory(req.getCategory());
        faq.setQuestion(req.getQuestion());
        faq.setAnswer(req.getAnswer());
        faqMapper.insert(faq);
    }

    @Transactional
    public void updateFaq(Long id, AdminFaqRequest req) {
        Faq faq = faqMapper.findById(id);

        if (faq == null) {
            throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND);
        }

        faq.setCategory(req.getCategory());
        faq.setQuestion(req.getQuestion());
        faq.setAnswer(req.getAnswer());
        faqMapper.update(faq);
    }

    @Transactional
    public void deleteFaq(Long id) {
        faqMapper.delete(id);
    }

    // ===== 사용자 =====
    public FaqPageResponse getUserFaqPage(
    	    int page,
    	    String category,
    	    String keyword
    	) {
    	    FaqCategory faqCategory = FaqCategory.from(category);

    	    int totalCount = faqMapper.countUserFaqs(
    	        faqCategory != null ? faqCategory.getCode() : null,
    	        keyword
    	    );

    	    int totalPages = totalCount == 0 ? 1 :
    	        (int) Math.ceil((double) totalCount / USER_PAGE_SIZE);

    	    page = Math.max(0, Math.min(page, totalPages - 1));
    	    int offset = page * USER_PAGE_SIZE;

    	    List<FaqResponse> content =
    	        faqMapper.findUserPage(
    	            offset,
    	            USER_PAGE_SIZE,
    	            faqCategory != null ? faqCategory.getCode() : null,
    	            keyword
    	        ).stream()
    	         .map(f -> new FaqResponse(
    	             f.getId(),
    	             f.getCategory(),
    	             f.getQuestion(),
    	             f.getAnswer()
    	         ))
    	         .toList();

    	    return new FaqPageResponse(
    	        content,
    	        page,
    	        totalPages,
    	        totalCount
    	    );
    	}
}