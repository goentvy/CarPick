// ReservationHistoryResponse.java
package com.carpick.domain.member.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReservationHistoryResponse {
    private Long id;
    private String reservationCode;
    private String type;  // CANCEL, CHANGE
    private String carName;  // 기존
    private String previousCar;  // 변경전 차량명
    private String newCarName;  // 변경후 차량명
    private String period;
    private String previous;
    private String changeType;  // 'car' 또는 'period'
    private String reason;
}
