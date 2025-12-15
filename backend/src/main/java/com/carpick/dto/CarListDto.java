package com.carpick.dto;

import lombok.Data;

@Data
public class CarListDto {
//    차량 목록 화면용 (리스트 카드)

    private Long vehicleId;

    // 차량 기본
    private String brand;
    private String modelName;
    private String carClass;
    private String fuelType;
    private Integer seatingCapacity;

    // 이미지
    private String mainImageUrl;

    // 가격
    private Integer standardPrice;

    // 지점
    private String branchName;

    // 상태
    private String status; // AVAILABLE, RENTED

}
