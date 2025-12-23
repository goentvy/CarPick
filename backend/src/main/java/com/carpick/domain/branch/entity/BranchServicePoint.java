package com.carpick.domain.branch.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BranchServicePoint {
    private Long pointId;                 // 포인트 ID (PK)
    private Long branchId;                // 지점 ID (FK)

    private String pointName;              // 장소명 (예: 1번 출구, 지하주차장)
    private String serviceType;            // 서비스 타입 (PICKUP / RETURN)

    private LocalTime serviceStartTime;    // 서비스 시작 시간
    private LocalTime serviceEndTime;      // 서비스 종료 시간
    private String serviceHours;           // 서비스 시간 텍스트 (프론트 노출용)

    private String locationDesc;           // 위치 설명 (텍스트)
    private Integer walkingTime;           // 도보 소요 시간 (분)
//    이때 앱 화면에 "도보 5분 소요" 같은 안내 문구를 띄워주기 위해 저장하는 데이터입니다.

    private LocalDateTime createdAt;        // 생성일시
    private LocalDateTime updatedAt;        // 수정일시




}
