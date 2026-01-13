package com.carpick.domain.car.dto.raw;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarDetailRawDto {
//    DB에서 한 번에 SELECT 할 수 있는 컬럼만

// ==================== CAR_SPEC (차량 스펙 테이블) ====================

    private Long specId;              // 스펙 고유 ID (PK)
    private String modelName;         // 모델명 (예: "쏘렌토")
    private String displayNameShort;  // 화면 표시용 짧은 이름 (예: "더 뉴 쏘렌토 4세대")
    private String carClass;          // 차량 등급 (예: "SUV", "SEDAN", "COMPACT")
    private String fuelType;          // 연료 타입 (예: "GASOLINE", "DIESEL", "HYBRID", "ELECTRIC")
    private Integer seatingCapacity;  // 탑승 인원 (예: 5)
    private Integer modelYearBase;    // 연식 (예: 2024)
    private String mainImageUrl;      // 차량 대표 이미지 URL
    private Integer minDriverAge;     // 최소 운전자 나이 (예: 21)
    private Integer minLicenseYears;  // 최소 운전 경력 년수 (예: 1)
    private String fuelEfficiency;    // 연비 (예: "15.2km/L")
    private String aiSummary;         // AI 추천 문구 (cs.ai_summary)
    private String carOptions;        // 차량 옵션 문자열 (cs.car_options)
    // ==================== VEHICLE_INVENTORY (차량 재고 테이블) ====================

    private Long vehicleId;           // 개별 차량 고유 ID (PK) - 실제 렌트 대상

    // ==================== BRANCH (지점 테이블) ====================

    private Long branchId;            // 지점 고유 ID (PK)
    private String branchName;        // 지점명 (예: "연세IT미래교육원 수원역캠퍼스")
    private String addressBasic;      // 지점 기본 주소 (예: "경기 수원시 팔달구 덕영대로 909")
    private BigDecimal latitude;      // 위도 (지도 표시용)
    private BigDecimal longitude;     // 경도 (지도 표시용)

    // ==================== PRICE_POLICY (가격 정책 테이블) ====================

    private BigDecimal dailyPrice;    // 일일 대여 가격 (원)
    private Integer discountRate;     // 할인율 (예: 30 → 30% 할인)

    // 기존 필드들 아래에 추가
    private String openTime;   // BRANCH.open_time
    private String closeTime;  // BRANCH.close_time

}
