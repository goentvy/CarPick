package com.carpick.domain.reservation.dtoV1;

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
        String driverName = "";
        if (reservation.getDriverLastName() != null) driverName += reservation.getDriverLastName();
        if (reservation.getDriverFirstName() != null) driverName += reservation.getDriverFirstName();

        return new GuestReservationDto(
                reservation.getReservationNo(),
                reservation.getDriverEmail(),
                driverName.isEmpty() ? "비회원" : driverName,
                reservation.getDriverPhone() != null ? reservation.getDriverPhone() : "",

                // 날짜 null-safe
                reservation.getStartDate() != null ? reservation.getStartDate().toLocalDate() : null,
                reservation.getEndDate() != null ? reservation.getEndDate().toLocalDate() : null,

                // BigDecimal null-safe
                reservation.getTotalAmountSnapshot() != null ? reservation.getTotalAmountSnapshot().longValue() : 0L,

                // Enum null-safe
                reservation.getReservationStatus() != null ? reservation.getReservationStatus().name() : "UNKNOWN"
        );
    }

}
