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
    private String description;

    private Integer dailyPrice;

    private Boolean isHighlight;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
