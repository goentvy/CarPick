package com.carpick.domain.notice.controller;

import com.carpick.domain.notice.dto.NoticeDto;
import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.service.NoticeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notice")
public class UserNoticeController {

    private final NoticeService noticeService;

    public UserNoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("")
    public ResponseEntity<Page<NoticeNtt>> list(
            @RequestParam(required = false) String keyword,
            @PageableDefault(page = 0, size = 30) Pageable pageable) {
        return ResponseEntity.ok(noticeService.searchNotices(keyword, pageable));
    }

    /**
     * ✅ 공지 상세 조회: 하나의 서비스 메서드로 호출하여 중복 증가 방지
     */
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto> detail(@PathVariable Long id) {
        // 이제 service가 Optional<NoticeDto>를 반환하므로 타입이 일치합니다.
        return noticeService.getNoticeWithUpdateViews(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}	