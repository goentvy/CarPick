package com.carpick.domain.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelRequest {
	
	@NotBlank
    private String reservationNumber;  // 취소할 예약번호
	
	@NotBlank
    private String reason;             // 취소 사유
	
}