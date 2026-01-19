package com.carpick.domain.car.dto.carListPage;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarListItemDto {
    private Long specId;                 //차종 스펙 / 상세 기준 (경진)
    private Long vehicleId;              // 차량 ID (상세 페이지 이동용)

    // 기본 정보
    private String displayNameShort;     // "캐스퍼" (카드용 짧은 모델명)
    private String ImgUrl;         // 썸네일 이미지

    // 스펙 정보 (부제용)
    private Integer modelYear;           // 2025
    private Integer seatingCapacity;     // 4인승

    // 태그 (프론트에서 파싱)
    private String driveLabels;          // "가솔린,경차,도심주행" (CSV string)

    // 가격 정보
    private BigDecimal originalPrice;    // 원가 367,878원
    private Integer discountRate;        // 할인율 80%
    private BigDecimal finalPrice;       // 최종가 128,000원


}
