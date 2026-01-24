package com.carpick.domain.reservation.dtoV1.response;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationCreateResponseDto {
    private String reservationNo; // 데모 예약번호
    private Long carId;
    private String insuranceCode;

    private int carDailyPrice;
    private int insuranceDailyPrice;
    private int totalPrice;

    private String message;

}
