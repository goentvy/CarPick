package com.carpick.domain.reservation.dto.request;

import lombok.Data;

@Data
public class ReservationPriceRequestDto {
    private String insuranceCode;  // NONE / NORMAL / FULL

}
