package com.carpick.domain.branch.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
    private Long branchId;
    private String branchCode;
    private String branchName;

    private String addressBasic;
    private String addressDetail;
    private String phone;

    private LocalTime openTime;
    private LocalTime closeTime;
    private String businessHours;

    private Double latitude;
    private Double longitude;

    private String regionCode;
    private String regionName;
    private String regionDept1;

    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;




}
