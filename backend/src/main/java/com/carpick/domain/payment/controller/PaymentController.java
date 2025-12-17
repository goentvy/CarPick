package com.carpick.domain.payment.controller;

import com.carpick.domain.payment.dto.CardPaymentRequest;
import com.carpick.domain.payment.dto.CardPaymentResponse;
import com.carpick.domain.payment.dto.PaymentApproveResponse;
import com.carpick.domain.payment.dto.PaymentReadyResponse;
import com.carpick.domain.payment.service.InicisPayService;
import com.carpick.domain.payment.service.KakaoPayService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
@Validated
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

    // 카드 결제 승인
    @PostMapping("/mock/approve")
    public ResponseEntity<CardPaymentResponse> approve(@Valid @RequestBody CardPaymentRequest request) {
        boolean valid =
                request.getCardNumber() != null &&
                        request.getCardNumber().matches("\\d{4}-\\d{4}-\\d{4}-\\d{4}") &&
                        request.getExpiry() != null &&
                        request.getExpiry().matches("\\d{2}/\\d{2}") &&
                        isFutureExpiry(request.getExpiry()) &&
                        request.getCvc() != null &&
                        request.getCvc().length() == 3 &&
                        request.getPassword2() != null &&
                        request.getPassword2().length() == 2 &&
                        request.getCardType() != null &&
                        request.getInstallment() != null &&
                        request.isAgree();

        if (valid) {
            return ResponseEntity.ok(
                    new CardPaymentResponse("APPROVED", "결제가 완료되었습니다.", request.getAmount())
            );
        } else {
            return ResponseEntity.badRequest().body(
                    new CardPaymentResponse("FAILED", "입력값 오류", request.getAmount())
            );
        }
    }

    private boolean isFutureExpiry(String expiry) {
        String[] parts = expiry.split("/");
        int month = Integer.parseInt(parts[0]);
        int year = Integer.parseInt(parts[1]);

        LocalDate now = LocalDate.now();
        int currentYear = now.getYear() % 100;
        int currentMonth = now.getMonthValue();

        return (year > currentYear) || (year == currentYear && month >= currentMonth);
    }
}
