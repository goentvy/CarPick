package com.carpick.domain.faq.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.carpick.domain.faq.dto.AdminFaqDetailResponse;
import com.carpick.domain.faq.dto.AdminFaqPageResponse;
import com.carpick.domain.faq.dto.AdminFaqRequest;
import com.carpick.domain.faq.enums.FaqCategory;
import com.carpick.domain.faq.service.FaqService;

import jakarta.validation.Valid;
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
	    model.addAttribute("req", new AdminFaqRequest());
	    model.addAttribute("categories", FaqCategory.values());
	    return "faqWrite";
	}

	@GetMapping("/{id}")
	public String editForm(@PathVariable Long id, Model model) {
	    AdminFaqDetailResponse faq = faqService.getAdminFaq(id);

	    AdminFaqRequest req = new AdminFaqRequest();
	    req.setCategory(faq.getCategory());
	    req.setQuestion(faq.getQuestion());
	    req.setAnswer(faq.getAnswer());

	    model.addAttribute("faq", faq);
	    model.addAttribute("req", req);
	    model.addAttribute("categories", FaqCategory.values());
	    return "faqWrite";
	}

	@PostMapping
	public String create(
	    @Valid @ModelAttribute("req") AdminFaqRequest req,
	    BindingResult bindingResult,
	    Model model
	) {
	    if (bindingResult.hasErrors()) {
	        model.addAttribute("categories", FaqCategory.values());
	        model.addAttribute("faq", null);   // 신규등록일 때 필요
	        return "faqWrite";
	    }

	    faqService.createFaq(req);
	    return "redirect:/admin/faq";
	}

	@PostMapping("/{id}")
	public String update(
	    @PathVariable Long id,
	    @Valid @ModelAttribute("req") AdminFaqRequest req,
	    BindingResult bindingResult,
	    Model model
	) {
	    if (bindingResult.hasErrors()) {
	        model.addAttribute("categories", FaqCategory.values());
	        model.addAttribute("faq", faqService.getAdminFaq(id));
	        return "faqWrite";
	    }

	    faqService.updateFaq(id, req);
	    return "redirect:/admin/faq";
	}

	    @PostMapping("/{id}/delete")
	    public String delete(@PathVariable Long id) {
	        faqService.deleteFaq(id);
	        return "redirect:/admin/faq";
	    }
}
