package com.carpick.domain.notice.controller;

import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.repository.NoticeRepository;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.http.ResponseEntity;

@Controller
public class UserController {
    private final NoticeRepository noticeRepository;

    public UserController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 뷰 페이지
    @GetMapping({"/", "/notices"})
    public String noticeList() {
        return "notice-list";
    }

    @GetMapping("/notice/{id}")
    public String noticeDetail(@PathVariable("id") Long id, Model model) {
        System.out.println("=== ID: " + id + " 상세 요청");
        
        NoticeNtt notice = noticeRepository.findById(id).orElse(null);
        if (notice == null) {
            System.out.println("=== 공지사항 없음");
            // 기본 데이터 생성
            notice = new NoticeNtt();
            notice.setId(id);
            notice.setTitle("공지사항을 찾을 수 없습니다");
            notice.setContent("해당 공지사항이 존재하지 않습니다.");
            notice.setViews(0L);
        } else {
            System.out.println("=== 공지사항 찾음: " + notice.getTitle());
            
            // 이전/다음 공지사항 조회
            try {
                NoticeNtt prevNotice = noticeRepository.findTop1ByDeletedFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(notice.getCreatedAt());
                NoticeNtt nextNotice = noticeRepository.findTop1ByDeletedFalseAndCreatedAtLessThanOrderByCreatedAtDesc(notice.getCreatedAt());
                
                model.addAttribute("prevNotice", prevNotice);
                model.addAttribute("nextNotice", nextNotice);
                
                System.out.println("=== 이전글: " + (prevNotice != null ? prevNotice.getTitle() : "없음"));
                System.out.println("=== 다음글: " + (nextNotice != null ? nextNotice.getTitle() : "없음"));
            } catch (Exception e) {
                System.out.println("=== 이전/다음 공지사항 조회 오류: " + e.getMessage());
            }
        }
        
        model.addAttribute("notice", notice);
        return "notice-detail";
    }

    // API 엔드포인트
    @GetMapping("/api/user/notices")
    @ResponseBody
    public List<NoticeNtt> getNotices() {
        try {
            return noticeRepository.findByDeletedFalseOrderByCreatedAtDesc();
        } catch (Exception e) {
            System.out.println("목록 조회 오류: " + e.getMessage());
            return List.of();
        }
    }

    @GetMapping("/api/user/notices/{id}")
    @ResponseBody
    public NoticeNtt getNotice(@PathVariable("id") Long id) {
        try {
            System.out.println("API 호출: ID=" + id);
            NoticeNtt notice = noticeRepository.findById(id).orElse(null);
            System.out.println("조회 결과: " + (notice != null ? notice.getTitle() : "null"));
            return notice;
        } catch (Exception e) {
            System.out.println("API 오류: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/api/user/notices/hit/{id}")
    @ResponseBody
    public ResponseEntity<Void> increaseViewCount(@PathVariable("id") Long id, HttpSession session) {
        try {
            String key = "noticeViewed_" + id;
            if (session.getAttribute(key) == null) {
                noticeRepository.incrementViewCount(id);
                session.setAttribute(key, true);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("조회수 증가 오류: " + e.getMessage());
            return ResponseEntity.ok().build();
        }
    }
}