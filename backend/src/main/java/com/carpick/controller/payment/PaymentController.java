package com.carpick.controller.payment;

import com.carpick.dto.payment.PaymentApproveResponse;
import com.carpick.dto.payment.PaymentReadyResponse;
import com.carpick.service.payment.InicisPayService;
import com.carpick.service.payment.KakaoPayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pay")
public class PaymentController {

    private final KakaoPayService kakaoPayService;
    private final InicisPayService inicisPayService;

    public PaymentController(KakaoPayService kakaoPayService, InicisPayService inicisPayService) {
        this.kakaoPayService = kakaoPayService;
        this.inicisPayService = inicisPayService;
    }

    // 카카오페이 결제 준비
    @PostMapping("/kakao/ready")
    public ResponseEntity<PaymentReadyResponse> kakaoReady(@RequestBody Map<String, Object> request) {
        String orderId = (String) request.get("orderId");
        int amount = (int) request.get("amount");
        PaymentReadyResponse response = kakaoPayService.ready(orderId, amount);
        return ResponseEntity.ok(response);
    }

    // 카카오페이 결제 승인
    @GetMapping("/kakao/approve")
    public ResponseEntity<PaymentApproveResponse> kakaoApprove(@RequestParam String pg_token) {
        PaymentApproveResponse response = kakaoPayService.approve(pg_token);
        return ResponseEntity.ok(response);
    }

    // 이니시스 결제 준비
    @PostMapping("/inicis/ready")
    public ResponseEntity<Map<String, Object>> inicisReady(@RequestBody Map<String, Object> request) {
        String orderId = (String) request.get("orderId");
        int amount = (int) request.get("amount");
        Map<String, Object> response = inicisPayService.ready(orderId, amount);
        return ResponseEntity.ok(response);
    }

    // 이니시스 결제 승인
    @PostMapping("/inicis/approve")
    public ResponseEntity<PaymentApproveResponse> inicisApprove(@RequestBody Map<String, Object> request) {
        String orderId = (String) request.get("orderId");
        String tid = (String) request.get("tid");
        int amount = (int) request.get("amount");
        PaymentApproveResponse response = inicisPayService.approve(orderId, tid, amount);
        return ResponseEntity.ok(response);
    }
}
