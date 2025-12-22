package com.carpick.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDto {
    private String email;
    private String reservationNumber;
    private String carName;
    private LocalDate reservationDate;
}
