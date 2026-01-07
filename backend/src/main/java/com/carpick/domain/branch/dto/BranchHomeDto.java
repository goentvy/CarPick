package com.carpick.domain.branch.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 홈/검색모달에서 쓰는 "가벼운" 지점 DTO
 * - 지점명, 간단 주소/라벨, 운영시간 텍스트 정도만
 */
@Getter
@Builder
public class BranchHomeDto {
    private Long branchId;
    private String branchName;

    // 주석: UI에서 "서울역 / 김포공항" 같은 라벨로 쓰고 싶으면 활용
    // MVP에선 addressBasic를 그대로 내려줘도 됨
    private String addressBasic;

    private String businessHours; // 예: "매일 08:00 ~ 22:00"
    private Boolean isActive;
}
