package com.carpick.domain.branch.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 카픽존 페이지에서 '카픽존 상세보기' 눌렀을 때 필요한 지점 DTO
 * - 주소/좌표/전화 등 맵/상세 패널에 필요한 정보 포함
 */
@Getter
@Builder
public class BranchZoneDetailDto {
    private Long branchId;
    private String branchCode;
    private String branchName;

    private String addressBasic;
    private String addressDetail;
    private String phone;

    private Double latitude;
    private Double longitude;

    private String businessHours;
    private Boolean isActive;
}
