package com.carpick.domain.reservationHistory.entity;

import com.carpick.domain.reservation.enums.ActorType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationStatusHistory {
    private Long historyId;
    private Long reservationId;

    private ReservationStatus statusPrev;
    private ReservationStatus statusCurr;

    private ActorType actorType;
    private String actorId;

    private String reason;

    private LocalDateTime recordedAt;

}
