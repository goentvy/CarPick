package com.carpick.domain.event.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Transient;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class EventDTO {
    private int id;
    private String title;
    private String content;
    private String startDate;
    private String endDate;
    
    private String thumbnail;

    @Transient
    private transient MultipartFile thumbnailFile;
    
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}