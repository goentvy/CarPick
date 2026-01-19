package com.carpick.domain.car.dto.carList.response;

import com.carpick.domain.car.enums.CarClass;
import com.carpick.domain.car.enums.FuelType;

public class CarCardDto {
private Long vehicleId;
    // 차량 기본 정보
    private String displayName;     // 예: "Carnival High-Limousine" or "K3 2세대"
    private Integer modelYear;
    private Integer seatingCapacity;
    private Integer minDriverAge;

    // 태그/분류
    private CarClass carClass;
    private FuelType fuelType;

    // 이미지
    private String imgUrl;

    // 가격 표시(카드 하단)
    private Integer discountRate;       // 30%
    private Integer originalPrice;      // 취소선 가격(옵션)
    private Integer finalPrice;         // 128,000원

    // 버튼 상태
    private boolean reservable;         // "예약 가능" 여부

}
