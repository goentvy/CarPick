package com.carpick.domain.car.entity;

import com.carpick.domain.car.enums.CarClass;
import com.carpick.domain.car.enums.FuelType;
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

    private CarClass carClass;
    private Integer modelYearBase;

    private String aiSummary;

    private FuelType fuelType;
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
    // 기존 필드들 아래에 추가
    private String useYn; // 운영용 삭제 여부(Y/N) – Admin 전용

}
