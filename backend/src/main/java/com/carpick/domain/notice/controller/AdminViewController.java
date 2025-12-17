package com.carpick.domain.notice.controller;

import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.service.NoticeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/notices")
public class AdminViewController {

    private final NoticeService noticeService;

    public AdminViewController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    /**
     * ✅ 목록 + 검색 + 페이징
     */
    @GetMapping
    public String list(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        Page<NoticeNtt> noticePage =
                noticeService.searchNotices(keyword, PageRequest.of(page, 10));

        model.addAttribute("notices", noticePage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", noticePage.getTotalPages());
        model.addAttribute("keyword", keyword == null ? "" : keyword);

        return "notice";
    }

    /**
     * ✅ 등록 화면
     */
    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("notice", new NoticeNtt());
        return "noticeForm";
    }

    /**
     * ✅ 수정 화면
     */
    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        NoticeNtt notice = noticeService.getNotice(id).orElse(null);
        if (notice == null) {
            return "redirect:/admin/notices";
        }
        model.addAttribute("notice", notice);
        return "noticeForm";
    }

    /**
     * 💾 등록 / 수정 처리
     */
    @PostMapping("/save")
    public String save(@ModelAttribute NoticeNtt notice) {
        noticeService.save(notice);
        return "redirect:/admin/notices";
    }

    /**
     * 🔍 상세 조회
     */
    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        NoticeNtt notice = noticeService.getNotice(id).orElse(null);
        if (notice == null) {
            return "redirect:/admin/notices";
        }
        model.addAttribute("notice", notice);
        return "noticeDetail";
    }

    /**
     * 🗑 삭제 (Soft Delete)
     */
    @PostMapping("/delete/{id}")
    @ResponseBody
    public String delete(@PathVariable Long id) {
        boolean result = noticeService.softDeleteNotice(id);
        return result ? "OK" : "FAIL";
    }
}
