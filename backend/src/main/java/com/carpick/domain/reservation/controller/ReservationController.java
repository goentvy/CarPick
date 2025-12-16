package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dto.ReservationRequest;
import com.carpick.domain.reservation.dto.ReservationRequest.CardPayment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {

    @PostMapping("/pay")
    public ResponseEntity<?> processPayment(@RequestBody ReservationRequest request) {
        // 1. 카드정보 존재 여부 확인
        CardPayment card = request.getCardPayment();
        if (card == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "DECLINED",
                    "message", "결제정보가 누락되었습니다."
            ));
        }

        // 2. 약관 동의 여부 확인
        if (!request.isAgreement() || !card.isAgree()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "DECLINED",
                    "message", "약관 동의가 필요합니다."
            ));
        }

        // 3. 결제 처리 로직 (예: PG 연동)
        boolean paymentSuccess = mockPayment(card);

        if (paymentSuccess) {
            return ResponseEntity.ok(Map.of(
                    "status", "APPROVED",
                    "message", "결제 완료"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "DECLINED",
                    "message", "결제 실패"
            ));
        }
    }

    private boolean mockPayment(CardPayment card) {
        // 실제 PG 연동 대신 카드번호 앞자리로 승인 여부 판단
        return card.getCardNumber() != null && card.getCardNumber().startsWith("1234");
    }
}
