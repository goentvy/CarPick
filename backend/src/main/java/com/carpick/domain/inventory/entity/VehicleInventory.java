package com.carpick.domain.inventory.entity;

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

    private String operationalStatus;
    private Integer mileage;
    private LocalDateTime lastInspectedAt;

    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
