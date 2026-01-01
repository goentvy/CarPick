package com.carpick.domain.aipick.dto;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class AiCarCardDto {
    private Long vehicleId;           // 차량 ID (예약 이동용)
    private Long specId;              // 스펙 ID

    // 차량 정보
    private String displayNameShort;  // 카드용 짧은 이름 (Carnival High-Limousine)
    private String brand;             // 브랜드 (기아)
    private String aiSummary;         // AI 설명 (가족여행에 최적화 된 공간)
    private String mainImageUrl;      // 차량 이미지

    // 태그/라벨
    private String driveLabels;       // 태그 (유아 카시트 2개, 넓은 트렁크)

    // 가격
    private BigDecimal basePrice;     // 기본 가격
    private Integer discountRate;     // 할인율 (30)
    private BigDecimal finalPrice;    // 최종 가격 (128,000)

}
