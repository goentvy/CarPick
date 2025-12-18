package com.carpick.domain.reservation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservationFormDto {

    // 예약 생성 요청용 (POST /reservation)

    @NotNull
    private Long vehicleId;

    @NotNull
    private Long insuranceId;

    // 운전자 정보
    @NotBlank
    private String driverLastName;

    @NotBlank
    private String driverFirstName;

    @NotNull
    private LocalDate driverBirthdate;

    @NotBlank
    private String driverPhone;

    @NotBlank
    private String driverEmail;

    @NotBlank
    private String driverLicenseNo;

    // 대여 정보
    @NotNull
    private Long pickupBranchId;

    @NotNull
    private Long returnBranchId;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    // 금액
    @NotNull
    @Min(0)
    private Integer totalAmount;
}

