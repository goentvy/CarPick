package com.carpick.domain.reservation.dtoV1.request;

import lombok.Data;

@Data
public class ReservationPriceRequestDto {
    private String insuranceCode;  // NONE / NORMAL / FULL

}
