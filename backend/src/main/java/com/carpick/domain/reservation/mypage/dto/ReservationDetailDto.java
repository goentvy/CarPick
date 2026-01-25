package com.carpick.domain.reservation.mypage.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationDetailDto {
    private Long reservationId;
    private String reservationNo;
    private String reservationStatus;
    private LocalDateTime createdAt;
    

    
    private Long vehicleId;
    private String brand;
    private String modelName;
    private String displayNameShort;
    private String carClass;

    private String driverLastName;
    private String driverFirstName;
    private LocalDate driverBirthdate;
    private String driverPhone;
    private String driverEmail;


    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime actualReturnDate;

    private String pickupType;
    private Long pickupBranchId;
    //브랜치아이디 필요해서 추가했습니다 -임승우
    private Long branchId;
    private String pickupAddress;

    private String returnType;
    private Long returnBranchId;
    private String returnAddress;



    private BigDecimal baseRentFeeSnapshot;
    private BigDecimal rentDiscountAmountSnapshot;
    private BigDecimal baseInsuranceFeeSnapshot;
    private BigDecimal insuranceDiscountAmountSnapshot;
    private BigDecimal optionFeeSnapshot;
    private BigDecimal couponDiscountSnapshot;
    private BigDecimal memberDiscountRateSnapshot;
    private BigDecimal eventDiscountAmountSnapshot;
    private BigDecimal totalAmountSnapshot;
    private BigDecimal appliedRentFeeSnapshot;
    private BigDecimal appliedInsuranceFeeSnapshot;

    private Long insuranceId;
    private Long couponId;
    private String cancelReason;
    private LocalDateTime cancelledAt;

}
