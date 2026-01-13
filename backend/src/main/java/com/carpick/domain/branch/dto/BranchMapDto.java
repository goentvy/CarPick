package com.carpick.domain.branch.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * ✅ 지도(맵)용 Branch DTO
 * - 지도 마커/검색에 필요한 최소 필드만
 */
@Getter @Setter
public class BranchMapDto {
    private Long branchId;
    private String branchCode;
    private String branchName;
    private String addressBasic;
    private Double latitude;
    private Double longitude;
}
