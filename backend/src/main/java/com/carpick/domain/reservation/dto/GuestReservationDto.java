package com.carpick.domain.reservation.dto;

import com.carpick.domain.reservation.entity.Reservation;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GuestReservationDto {
    @JsonProperty("reservationNo")
    private String reservationNumber;
    private String driverEmail;
    private String driverName;
    private String driverPhone;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalAmount;
    private String status;

    public static GuestReservationDto from(Reservation reservation) {
        return new GuestReservationDto(
                reservation.getReservationNo(),
                reservation.getDriverEmail(),
                reservation.getDriverLastName() + reservation.getDriverFirstName(),
                reservation.getDriverPhone(),
                reservation.getStartDate().toLocalDate(),
                reservation.getEndDate().toLocalDate(),
                reservation.getTotalAmountSnapshot().longValue(),
                reservation.getReservationStatus().name()
        );
    }
}
