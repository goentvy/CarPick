package com.carpick.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentReadyResponse {
    private String orderId;
    private int amount;
    private String redirectUrl;
}