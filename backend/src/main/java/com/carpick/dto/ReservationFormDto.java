package com.carpick.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationFormDto {

//    예약 생성 요청용 (POST /reservation)

    private Long vehicleId;
    private Long insuranceId;

    // 운전자 정보
    private String driverLastName;
    private String driverFirstName;
    private LocalDate driverBirthdate;
    private String driverPhone;
    private String driverEmail;
    private String driverLicenseNo;

    // 대여 정보
    private Long pickupBranchId;
    private Long returnBranchId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // 금액
    private Integer totalAmount;
}
