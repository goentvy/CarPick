package com.carpick.controller;


import com.carpick.ntt.NoticeNtt;
import com.carpick.service.NoticeService;
import com.carpick.service.NoticeAdminLoginService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api")
public class NoticeController {
    private final NoticeService noticeService;
    private final NoticeAdminLoginService noticeAdminLoginService;

    public NoticeController(NoticeService noticeService, NoticeAdminLoginService noticeAdminLoginService) {
        this.noticeService = noticeService;
        this.noticeAdminLoginService = noticeAdminLoginService;
    }

    // 관리자 로그인
    @PostMapping("/admin/login")
    public ResponseEntity<String> adminLogin(@RequestBody AdminLoginRequest request) {
        if (noticeAdminLoginService.validateAdmin(request.getUsername(), request.getPassword())) {
            return ResponseEntity.ok("로그인 성공");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
    }

    static class AdminLoginRequest {
        public String username;
        public String password;
        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }


    // 관리자 공지 목록
    @GetMapping("/admin/notices")
    public ResponseEntity<List<NoticeNtt>> listNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    // 관리자 공지 상세
    @GetMapping("/admin/notices/{id}")
    public ResponseEntity<NoticeNtt> getNotice(@PathVariable Long id) {
        return noticeService.getNotice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 공지 등록 (관리자)
    @PostMapping("/admin/notices")
    public ResponseEntity<NoticeNtt> createNotice(@RequestBody NoticeNtt payload) {
        if (payload.getTitle() == null || payload.getTitle().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        NoticeNtt created = noticeService.createNotice(payload.getTitle(), payload.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 공지 수정 (관리자)
    @PutMapping("/admin/notices/{id}")
    public ResponseEntity<NoticeNtt> updateNotice(@PathVariable Long id, @RequestBody NoticeNtt payload) {
        return noticeService.updateNotice(id, payload.getTitle(), payload.getContent())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 공지 삭제 (소프트)
    @DeleteMapping("/admin/notices/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        boolean ok = noticeService.softDeleteNotice(id);
        if (ok) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

    // 공개 API: 공지 목록
    @GetMapping("/notices")
    public ResponseEntity<List<NoticeNtt>> publicListNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    // 공개 API: 공지 상세
    @GetMapping("/notices/{id}")
    public ResponseEntity<NoticeNtt> publicGetNotice(@PathVariable Long id) {
        return noticeService.getNotice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}