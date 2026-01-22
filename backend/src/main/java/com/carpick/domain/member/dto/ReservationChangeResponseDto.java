package com.carpick.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationChangeResponseDto {
    private boolean success;
    private Long reservationId;
    private String message;
}
