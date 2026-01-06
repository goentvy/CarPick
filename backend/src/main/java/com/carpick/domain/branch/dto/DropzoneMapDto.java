package com.carpick.domain.branch.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * ✅ 지도(맵)용 Dropzone DTO
 * - 지도 마커/선택에 필요한 최소 필드만
 */
@Getter @Setter
public class DropzoneMapDto {
    private Long dropzoneId;
    private Long branchId;
    private String dropzoneName;
    private String addressText;
    private String locationDesc;
    private Integer walkingTimeMin;
    private Double latitude;
    private Double longitude;
    private Integer isActive; // 0/1
}
