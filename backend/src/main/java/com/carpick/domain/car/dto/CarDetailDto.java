package com.carpick.domain.car.dto;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CarDetailDto {

//  차량 상세 페이지용 (이미지 + 6개 카드 정보)
	@NotNull
    private Long vehicleId;

    // 차량 정보
    @NotBlank
    private String brand;

    @NotBlank
    private String modelName;

    @NotBlank
    private String carClass;

    @NotBlank
    private String fuelType;

    @NotNull
    @Min(1)
    private Integer seatingCapacity;

    private String trunkCapacity;
    private String fuelEfficiency;

    @NotBlank
    private String modelYear;

    // 이미지
    @NotBlank
    private String mainImageUrl;

    // 가격
    @NotNull
    @Min(0)
    private Integer standardPrice;

    // 지점
    @NotBlank
    private String branchName;

    @NotBlank
    private String addressBasic;

    // 옵션
    private List<String> highlightOptions;

}
