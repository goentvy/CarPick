package com.carpick.domain.notice.controller;

import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.service.NoticeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notice")
public class UserNoticeController {

    private final NoticeService noticeService;

    public UserNoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // 유저용 공지 목록 + 검색 + 페이징
    @GetMapping("/page")
    public ResponseEntity<Page<NoticeNtt>> list(
            @RequestParam(required = false) String keyword,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<NoticeNtt> noticePage = noticeService.searchNotices(keyword, pageable);
        return ResponseEntity.ok(noticePage);
    }

    // 전체 공지 목록
    @GetMapping
    public ResponseEntity<List<NoticeNtt>> listAll() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    // 공지 상세 조회 (조회수 1 증가)
    @GetMapping("/{id}")
    public ResponseEntity<NoticeNtt> detail(@PathVariable Long id) {
        // 상세 조회 시 조회수 1 증가
        noticeService.incrementViewCount(id);

        return noticeService.getNotice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
