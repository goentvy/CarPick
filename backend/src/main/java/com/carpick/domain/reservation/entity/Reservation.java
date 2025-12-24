package com.carpick.domain.reservation.entity;


import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    private Long reservationId;
    private String reservationNo;

    /* WHO */
    private Long userId;
    private Long vehicleId;

    /* DRIVER */
    private String driverLastName;
    private String driverFirstName;
    private LocalDate driverBirthdate;
    private String driverPhone;
    private String driverEmail;
    private String driverLicenseNo;

    /* WHEN */
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime actualReturnDate;

    /* WHERE */
    private String pickupType;
    private Long pickupBranchId;
    private String pickupAddress;

    private String returnType;
    private Long returnBranchId;
    private String returnAddress;

    /* WHAT & HOW MUCH (SNAPSHOTS) */
    private Long insuranceId;
    private Long couponId;

    /* 1. 기본 대여료 */
    private BigDecimal baseRentFeeSnapshot;
    private BigDecimal rentDiscountAmountSnapshot;

    /* 2. 보험료 */
    private BigDecimal baseInsuranceFeeSnapshot;
    private BigDecimal insuranceDiscountAmountSnapshot;

    /* 3. 옵션 요금 */
    private BigDecimal optionFeeSnapshot;

    /* 4. 쿠폰 할인액 */
    private BigDecimal couponDiscountSnapshot;

    /* 5. 기타 할인 */
    private BigDecimal memberDiscountRateSnapshot;
    private BigDecimal eventDiscountAmountSnapshot;

    /* 6. 최종 결제액 */
    private BigDecimal totalAmountSnapshot;

    /* 7. 실제 적용된 요금 */
    private BigDecimal appliedRentFeeSnapshot;
    private BigDecimal appliedInsuranceFeeSnapshot;

    private String agreementYn;

    /* STATUS */
    private String status;
    private String cancelReason;
    private LocalDateTime cancelledAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
