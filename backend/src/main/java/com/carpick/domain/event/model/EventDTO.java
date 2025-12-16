package com.carpick.domain.event.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EventDTO {
    private int id;
    private String title;
    private String content;
    private String startDate;
    private String endDate;
    private String thumbnail;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}