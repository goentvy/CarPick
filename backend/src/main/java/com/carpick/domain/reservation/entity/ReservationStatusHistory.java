package com.carpick.domain.reservation.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationStatusHistory {
    private Long historyId;
    private Long reservationId;

    private String statusPrev;
    private String statusCurr;

    private String actorType;
    private String actorId;

    private String reason;

    private LocalDateTime recordedAt;

}
