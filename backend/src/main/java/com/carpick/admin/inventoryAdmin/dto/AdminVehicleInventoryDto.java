package com.carpick.admin.inventoryAdmin.dto;

import com.carpick.domain.car.enums.VehicleStatus;
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

    private Integer mileage;              // 주행거리 (nullable)
    private LocalDateTime lastInspectedAt; // 마지막 점검일 (nullable)

    private Boolean isActive;   // 활성 여부 (true/false)

    private String useYn;       // 'Y' / 'N' (소프트 삭제용)
    private LocalDateTime deletedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
