package com.carpick.domain.member.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class ReservationHistoryResponse {
    private Long id;
    private Long reservationId;
    private String actionType;   // CANCEL, CHANGE
    private String changeTypes;  // "CAR", "CAR,PERIOD" 등

    // 변경전
    private String oldCarName;
    private String oldStartDate;
    private String oldEndDate;
    private String oldLocation;

    // 변경후
    private String newCarName;
    private String newStartDate;
    private String newEndDate;
    private String newLocation;

    private String reason;
    private String createdAt;
}

