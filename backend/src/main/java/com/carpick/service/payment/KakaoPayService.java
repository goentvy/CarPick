package com.carpick.service.payment;

import com.carpick.dto.payment.PaymentApproveResponse;
import com.carpick.dto.payment.PaymentReadyResponse;
import org.springframework.stereotype.Service;

@Service
public class KakaoPayService {
    public PaymentReadyResponse ready(String orderId, int amount) {
        // 실제 카카오페이 API 호출 로직 필요
        return new PaymentReadyResponse(orderId, amount, "https://kakaopay.com/redirect");
    }

    public PaymentApproveResponse approve(String pgToken) {
        // 실제 카카오페이 승인 API 호출 로직 필요
        return new PaymentApproveResponse("ORDER123", 55000, "APPROVED");
    }
}