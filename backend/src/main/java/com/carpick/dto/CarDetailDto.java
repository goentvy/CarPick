package com.carpick.dto;

import lombok.Data;

import java.util.List;

@Data
public class CarDetailDto {

//    차량 상세 페이지용 (이미지 + 6개 카드 정보)
private Long vehicleId;

    // 차량 정보
    private String brand;
    private String modelName;
    private String carClass;
    private String fuelType;
    private Integer seatingCapacity;
    private String trunkCapacity;
    private String fuelEfficiency;
    private String modelYear;

    // 이미지
    private String mainImageUrl;

    // 가격
    private Integer standardPrice;

    // 지점
    private String branchName;
    private String addressBasic;

    // 옵션
    private List<String> highlightOptions;

}
