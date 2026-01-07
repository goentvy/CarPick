package com.carpick.domain.inventory.entity;

import com.carpick.domain.inventory.enums.InventoryOperationalStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleInventory {
    private Long vehicleId;

    private Long specId;
    private Long branchId;

    private String vehicleNo;
    private String vin;

    private Integer modelYear;

    private InventoryOperationalStatus operationalStatus; //현재 운영 상태 'AVAILABLE','RESERVED','RENTED','MAINTENANCE
    private Integer mileage;
    private LocalDateTime lastInspectedAt;

    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // 기존 필드들 아래에 추가
    private String useYn; // 삭제 여부 (Y/N)
}
