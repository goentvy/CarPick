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
public class VehicleStatusHistory {
    private Long historyId;

    private Long vehicleId;
    private Long branchId;

    private String statusPrev;
    private String statusCurr;

    private Integer mileageKm;
    private Integer fuelLevel;

    private String comments;
    private String photoUrl;
    private String managerId;

    private LocalDateTime recordedAt;

}
