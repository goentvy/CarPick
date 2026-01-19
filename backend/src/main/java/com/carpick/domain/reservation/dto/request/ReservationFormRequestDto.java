package com.carpick.domain.reservation.dto.request;

import com.carpick.domain.reservation.enums.RentType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationFormRequestDto {

    // ===== 차량 정보 =====
    private Long specId;              // 차종 ID

    // ===== 지점 정보 =====
    private Long pickupBranchId;      // 픽업 지점 ID


    // ===== 대여 기간 =====
    private RentType rentType;        // SHORT / LONG

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endAt;

}
