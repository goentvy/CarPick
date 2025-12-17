package com.carpick.domain.branch.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BranchServicePoint {
    private Long pointId;
    private Long branchId;

    private String pointName;

    private LocalTime serviceStartTime;
    private LocalTime serviceEndTime;
    private String serviceHours;

    private String serviceType; // PICKUP / RETURN
    private String locationDesc;
    private Integer walkingTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
