package com.carpick.domain.branch.dto;


import lombok.Data;

@Data
public class BranchDto {
//    지점 선택 드롭다운 / 상세 표시용
private Long branchId;
    private String branchCode;
    private String branchName;

    private String addressBasic;
    private String phone;

    private String openTime;
    private String closeTime;

    private Boolean isActive;

}
