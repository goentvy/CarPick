package com.carpick.domain.car.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarOption {
    private Long optionId;
    private Long carSpecId;

    private String optionName;
    private String optionDescription;

    private Integer optionDailyPrice;

    private Boolean isHighlight;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // 기존 필드들 아래에 추가
    private String useYn; // 삭제 여부 (Y/N)

}
