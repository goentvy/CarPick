package com.carpick.domain.event.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Transient;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EventDTO {
	
	  private int id;

	    @NotBlank
	    private String title;

	    @NotBlank
	    private String content;

	    @NotBlank
	    private String startDate;

	    @NotBlank
	    private String endDate;

	    private String thumbnail;

	    @Transient
	    private transient MultipartFile thumbnailFile;

	    private LocalDateTime created_at;
	    private LocalDateTime updated_at;
}