package com.carpick.domain.faq.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.carpick.domain.faq.dto.AdminFaqDetailResponse;
import com.carpick.domain.faq.dto.AdminFaqPageResponse;
import com.carpick.domain.faq.dto.AdminFaqRequest;
import com.carpick.domain.faq.enums.FaqCategory;
import com.carpick.domain.faq.service.FaqService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin/faq")
@RequiredArgsConstructor
public class AdminFaqController {

	private final FaqService faqService;

	@GetMapping
	public String list(@RequestParam(defaultValue = "0") int page, @RequestParam(required = false) String category,
			@RequestParam(required = false) String keyword, Model model) {
		AdminFaqPageResponse faqPage =
	            faqService.getFaqPage(page, category, keyword);

	        model.addAttribute("faqs", faqPage.getFaqs());
	        model.addAttribute("currentPage", faqPage.getCurrentPage());
	        model.addAttribute("totalPages", faqPage.getTotalPages());
	        model.addAttribute("totalCount", faqPage.getTotalCount());
	        model.addAttribute("category", category);
	        model.addAttribute("keyword", keyword);
	        model.addAttribute("categories", FaqCategory.values());

	        return "faq";
	}

	@GetMapping("/new")
	public String writeForm(Model model) {
	    model.addAttribute("faq", null);
	    model.addAttribute("categories", FaqCategory.values());
	    return "faqWrite";
	}

	@GetMapping("/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        AdminFaqDetailResponse faq = faqService.getAdminFaq(id);
        model.addAttribute("faq", faq);
        model.addAttribute("categories", FaqCategory.values());
        return "faqWrite";
    }

	 @PostMapping
	    public String create(AdminFaqRequest req) {
	        faqService.createFaq(req);
	        return "redirect:/admin/faq";
	    }

	    @PostMapping("/{id}")
	    public String update(@PathVariable Long id, AdminFaqRequest req) {
	        faqService.updateFaq(id, req);
	        return "redirect:/admin/faq";
	    }

	    @PostMapping("/{id}/delete")
	    public String delete(@PathVariable Long id) {
	        faqService.deleteFaq(id);
	        return "redirect:/admin/faq";
	    }
}
