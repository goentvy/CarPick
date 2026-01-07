package com.carpick.domain.branch.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
    private Long branchId;                 // 지점 ID (PK)

    private String branchCode;             // 지점 코드 (업무 식별용, UNIQUE)
    private String branchName;             // 지점명 (노출용)

    private String addressBasic;            // 기본 주소
    private String addressDetail;           // 상세 주소
    private String phone;                   // 지점 전화번호

    private LocalTime openTime;             // 오픈 시간
    private LocalTime closeTime;            // 마감 시간
    private String businessHours;            // 영업시간 텍스트 (프론트 노출용)

    private BigDecimal latitude;             // 위도 (지도 표시용)
    private BigDecimal longitude;            // 경도 (지도 표시용)
    private String regionDept1;              // 지역 구분 (서울/경기 등)

    private Boolean isActive;                // 활성 여부 (1=사용, 0=미사용)

    private String canManageInventoryYn;     // 재고 관리 가능 여부 (Y/N)
    private String canManageVehicleStatusYn; // 차량 상태 관리 가능 여부 (Y/N)
    private String canPickupReturnYn;         // 방문 인수/반납 가능 여부 (Y/N)
    private String canDeliveryYn;             // 딜리버리 가능 여부 (Y/N)

    private Integer deliveryRadiusKm;         // 딜리버리 반경 (km)

    private LocalDateTime createdAt;          // 생성일시
    private LocalDateTime updatedAt;          // 수정일시
    // 기존 필드들 아래에 추가
    private String useYn; // 삭제 여부 (Y/N)


}
