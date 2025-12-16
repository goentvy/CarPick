package com.carpick.domain.car.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarStatusHistory {
    private Long historyId;
    private Long vehicleId;

    private String statusPrev;
    private String statusCurr;

    private String comments;
    private Integer mileage;
    private Integer fuelLevel;
    private String photoUrl;

    private LocalDateTime recordedAt;
    private String managerId;

}
