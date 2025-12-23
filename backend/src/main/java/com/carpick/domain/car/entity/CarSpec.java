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
public class CarSpec {
    private Long specId;

    private String brand;
    private String modelName;
    private String displayNameShort;

    private String carClass;
    private Integer modelYearBase;

    private String aiSummary;

    private String fuelType;
    private String transmissionType;

    private Integer minDriverAge;
    private Integer minLicenseYears;

    private Integer seatingCapacity;
    private String trunkCapacity;
    private String fuelEfficiency;

    private String mainImageUrl;
    private String imgUrl;
    private String aiKeywords;

    private String driveLabels;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
