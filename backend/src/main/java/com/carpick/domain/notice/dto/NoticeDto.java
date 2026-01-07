package com.carpick.domain.notice.dto;

import java.time.LocalDateTime;

public class NoticeDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long views; // 조회수 필드 추가

    // ✅ 추가: 이전/다음글 정보를 위한 필드
    private NavInfo prev;
    private NavInfo next;

    public NoticeDto() {}

    public NoticeDto(Long id, String title, String content, LocalDateTime createdAt, LocalDateTime updatedAt, Long views) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.views = views;
    }

    // ✅ 추가: 이전/다음글 정보를 담는 내부 클래스
    public static class NavInfo {
        private Long id;
        private String title;
        public NavInfo(Long id, String title) { this.id = id; this.title = title; }
        public Long getId() { return id; }
        public String getTitle() { return title; }
    }

    // Getter / Setter
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getViews() { return views; }
    
    public NavInfo getPrev() { return prev; }
    public void setPrev(NavInfo prev) { this.prev = prev; }
    public NavInfo getNext() { return next; }
    public void setNext(NavInfo next) { this.next = next; }
}