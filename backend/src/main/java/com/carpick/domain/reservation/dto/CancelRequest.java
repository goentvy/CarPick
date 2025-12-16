package com.carpick.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelRequest {
    private String reservationNumber;  // 취소할 예약번호
    private String reason;             // 취소 사유
}