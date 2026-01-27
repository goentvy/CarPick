package com.carpick.domain.member.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CurrentReservationDto {
    private Long vehicleId;
    private Long specId;
    private String brand;
    private String displayNameShort;
    private LocalDate startDate;
    private String carName;  // displayNameShort
}
