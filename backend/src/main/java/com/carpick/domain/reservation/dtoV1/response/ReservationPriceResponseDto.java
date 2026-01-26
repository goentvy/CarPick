package com.carpick.domain.reservation.dtoV1.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationPriceResponseDto {
    private int carDailyPrice;   // 차량 1일 요금
    private int insurancePrice;  // 보험 1일 요금
    private int totalPrice;      // 총 결제 금액 (1일 기준)
}

