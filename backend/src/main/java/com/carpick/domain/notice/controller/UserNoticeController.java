package com.carpick.domain.notice.controller;

import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.repository.NoticeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notice")
public class UserNoticeController {

    private final NoticeRepository noticeRepository;

    public UserNoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    /**
     * ✅ 공지사항 목록
     * GET /api/notice
     */
    @GetMapping
    public List<NoticeNtt> list() {
        return noticeRepository.findByDeletedFalseOrderByCreatedAtDesc();
    }

    /**
     * ✅ 공지사항 상세
     * GET /api/notice/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<NoticeNtt> detail(@PathVariable("id") Long id) {
        return noticeRepository.findByIdAndDeletedFalse(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ✅ 조회수 증가
     * POST /api/notice/{id}/view
     */
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> view(@PathVariable("id") Long id) {
        noticeRepository.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }
}
