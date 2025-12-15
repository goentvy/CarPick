package com.carpick.model;


import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    private Long reservationId;
    private String reservationNo;

    private Long userId;
    private Long vehicleId;

    // 운전자 정보
    private String driverLastName;
    private String driverFirstName;
    private LocalDate driverBirthdate;
    private String driverPhone;
    private String driverEmail;
    private String driverLicenseNo;
    private LocalDate driverLicenseExpiry;
    private String driverVerifiedYn;

    // 지점 / 기간
    private Long pickupBranchId;
    private Long returnBranchId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime actualReturnDate;

    private Long insuranceId;

    private String status;
    private String cancelReason;
    private Integer totalAmount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
