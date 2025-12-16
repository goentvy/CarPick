package com.carpick.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardPaymentResponse {
    private String status;   // APPROVED / FAILED
    private String message;  // 결과 메시지
    private int amount;      // 결제 금액
}
