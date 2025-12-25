package com.carpick.admin.carAdmin.dto;

import com.carpick.domain.car.enums.CarClass;
import com.carpick.domain.car.enums.FuelType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminCarSpecDto {
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

    private String useYn;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss",timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;

}
