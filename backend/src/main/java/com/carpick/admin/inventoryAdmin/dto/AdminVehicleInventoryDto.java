package com.carpick.admin.inventoryAdmin.dto;

import com.carpick.domain.car.enums.FuelType;
import com.carpick.domain.car.enums.VehicleStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminVehicleInventoryDto {

    private Long vehicleId;      // PK
    private Long specId;         // CAR_SPEC FK
    private Long branchId;       // BRANCH FK

    private String vehicleNo;    // 차량번호
    private String vin;          // 차대번호 (nullable)

    private Integer modelYear;   // 실차 연식 (nullable)

    private VehicleStatus operationalStatus;  // 운영 상태 ENUM (AVAILABLE, RESERVED, ...)

    private Integer mileage;// 주행거리 (nullable)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime lastInspectedAt; // 마지막 점검일 (nullable)


    private String useYn;       // 'Y' / 'N' (소프트 삭제용)
    private LocalDateTime deletedAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;

    // ===== 조인용 필드 추가 =====
    private String modelName;      // CAR_SPEC.model_name
    private String brand;          // CAR_SPEC.brand
    private String mainImageUrl;   // CAR_SPEC.main_image_url
    private FuelType fuelType;     // CAR_SPEC.fuel_type
    private String branchName;     // BRANCH.branch_name


}
