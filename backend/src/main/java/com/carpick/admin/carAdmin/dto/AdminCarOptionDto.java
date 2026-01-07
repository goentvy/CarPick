package com.carpick.admin.carAdmin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminCarOptionDto {
    private Long optionId;

    private String optionName;
    private String optionDescription;

    private Integer optionDailyPrice;

    private Boolean isHighlight;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss",timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;
    // 기존 필드들 아래에 추가
    private String useYn; // 삭제 여부 (Y/N)

}
