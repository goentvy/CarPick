package com.carpick.domain.reservation.mypage.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ReservationListDto {

    // 예약 기본 정보
    private Long reservationId;
    private String reservationNo;

    // 차량 정보 (CAR_SPEC JOIN)
    private String brand;
    private String displayNameShort;  // 카드용 짧은 이름

    // 대여 기간
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // 금액 & 상태
    private BigDecimal totalAmountSnapshot;
    private String reservationStatus;  // PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELED

}
