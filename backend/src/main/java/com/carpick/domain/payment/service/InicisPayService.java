package com.carpick.domain.payment.service;

import com.carpick.domain.payment.dto.PaymentApproveResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InicisPayService {
    public Map<String, Object> ready(String orderId, int amount) {
        // 실제 이니시스 API 호출 로직 필요
        Map<String, Object> response = new HashMap<>();
        response.put("mid", "INIpayTestMID");
        response.put("orderId", orderId);
        response.put("amount", amount);
        response.put("returnUrl", "http://localhost:3000/callback/inicis");
        return response;
    }

    public PaymentApproveResponse approve(String orderId, String tid, int amount) {
        // 실제 이니시스 승인 API 호출 로직 필요
        return new PaymentApproveResponse(orderId, amount, "APPROVED");
    }
}