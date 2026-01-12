package com.carpick.domain.notice.dto;

import java.time.LocalDateTime;

public class NoticeDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long views;
    
    // ✅ 1. 이 필드가 누락되어 오류가 발생했습니다.
    private boolean isNew; 

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

    public static class NavInfo {
        private Long id;
        private String title;
        private boolean isNew; 
        
        public NavInfo(Long id, String title, boolean isNew) { 
            this.id = id; 
            this.title = title; 
            this.isNew = isNew;
        }
        
        public Long getId() { return id; }
        public String getTitle() { return title; }
        public boolean isIsNew() { return isNew; } 
    }

    // --- Getter / Setter ---
    
    // ✅ 2. setNew 메서드를 추가하여 서비스의 오류를 해결합니다.
    public boolean isNew() { return isNew; }
    public void setNew(boolean isNew) { this.isNew = isNew; }

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