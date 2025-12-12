package com.carpick.controller;

import com.carpick.ntt.NoticeNtt;
import com.carpick.repository.NoticeRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AdminViewController {
    private final NoticeRepository noticeRepository;

    public AdminViewController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @GetMapping("/admin")
    public String adminLogin() {
        return "admin-login";
    }

    @GetMapping("/admin/notices")
    public String adminNotices() {
        return "admin-notices";
    }

    @GetMapping("/admin/notices/new")
    public String adminNoticeNew() {
        return "admin-notice-form";
    }

    @GetMapping("/admin/notices/edit/{id}")
    public String adminNoticeEdit(@PathVariable Long id, Model model) {
        NoticeNtt notice = noticeRepository.findById(id).orElse(null);
        model.addAttribute("notice", notice);
        return "admin-notice-form";
    }

    @GetMapping("/admin/notices/{id}")
    public String adminNoticeDetail(@PathVariable Long id, Model model) {
        NoticeNtt notice = noticeRepository.findById(id).orElse(null);
        if (notice == null) {
            return "redirect:/admin/notices";
        }
        model.addAttribute("notice", notice);
        return "admin-notice-detail";
    }
}
