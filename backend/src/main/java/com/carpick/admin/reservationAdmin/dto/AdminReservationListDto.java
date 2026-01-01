package com.carpick.admin.reservationAdmin.dto;

import com.carpick.domain.reservation.enums.ReservationStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminReservationListDto {
    private Long reservationId;           // PK - 상세이동용 ✅
    private String reservationNo;         // 화면표시용 ✅
    private String name;              // 예약자 ✅
    private String displayNameShort;      // 차량명 (소렌토 등) ✅

    private String carNo;                 // 차량번호 - 있어도 OK ✅
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime startDate;      // 대여시작 ✅
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime endDate;        // 반납예정 ✅
    private BigDecimal totalAmountSnapshot; // 결제금액 ✅
    private ReservationStatus reservationStatus; // 상태 ✅


}
