package com.carpick.domain.car.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarInventory {

    private Long vehicleId;

    private Long carSpecId;
    private Long priceId;
    private Long branchId;

    private String licensePlate;
    private String color;
    private String modelYear;

    private Integer currentMileage;
    private String status; // AVAILABLE, RENTED, MAINTENANCE

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
