package com.carpick.domain.car.dto;

import lombok.Data;

@Data
public class CarListDto {
//    차량 목록 화면용 (리스트 카드)
// 차량 고유 식별자 (차량 상세 페이지 이동 시 사용)
private Long vehicleId;
    // 차량 브랜드명 (예: 현대, 기아)
    private String brand;

    // 차량 모델명 (예: 더 뉴 쏘렌토)
    private String modelName;

    // 차급 정보 (예: 경차, 준중형, SUV, 대형)
    private String carClass;

    // 연료 타입 (예: 가솔린, 하이브리드, 전기)
    private String fuelType;

    // 승차 가능 인원 수 (프론트에서 "N인승" 형태로 표시)
    private Integer seatingCapacity;
    // 차량 대표 이미지 URL (차량 카드 썸네일 이미지)

    private String mainImageUrl;

    // 가격
    // 1일 기준 대여 요금 (단위: 원)
    private Integer standardPrice;

    // 지점
//    (예: 제주공항점)
    private String branchName;

    // 상태
    // AVAILABLE   : 예약 가능
    // RENTED      : 대여 중
    // MAINTENANCE : 정비 중
    private String status; // AVAILABLE, RENTED

}
