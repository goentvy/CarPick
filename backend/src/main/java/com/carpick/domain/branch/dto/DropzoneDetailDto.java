package com.carpick.domain.branch.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * DROPZONE_POINT 마스터 데이터 DTO
 * - 옵션1: 혼잡도는 포함하지 않음
 */
@Getter
@Setter
public class DropzoneDetailDto {
    private Long dropzoneId;
    private Long branchId;

    private String dropzoneCode;
    private String dropzoneName;

    private String addressText;
    private String locationDesc;
    private Integer walkingTimeMin;

    private Double latitude;
    private Double longitude;

    private String serviceHours;

    private Boolean isActive;
}