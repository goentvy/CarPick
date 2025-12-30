package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dto.ReservationRequest;
import com.carpick.domain.reservation.dto.ReservationRequest.CardPayment;
import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.dto.request.ReservationPriceRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationCreateResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationFormResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import com.carpick.domain.reservation.service.ReservationUiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationUiService reservationUiService;
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
            // 주문번호 생성 (예: UUID, 시퀀스, DB 저장 후 PK 반환)
            String orderId = java.util.UUID.randomUUID().toString();
            return ResponseEntity.ok(Map.of(
                    "status", "APPROVED",
                    "message", "결제 완료",
                    "orderId", orderId
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
    /**
     * 예약 페이지 초기 데이터 내려주기
     * 예: GET /api/reservation/form?carId=1
     */
    @GetMapping("/form")
    public ReservationFormResponseDto getForm(@RequestParam("carId") Long carId){
        return reservationUiService.getForm(carId);

    }
    /**
     * 보험 선택 시 가격 재계산
     * 예: POST /api/reservation/price?carId=1
     * Body: { "insuranceCode": "FULL" }
     */
    @PostMapping("/price")
    public ReservationPriceResponseDto calcPrice(@RequestParam("carId") Long carId
            , @RequestBody(required = false) ReservationPriceRequestDto req){
        return reservationUiService.calcPrice(carId, req);
    }
//    @PostMapping("/create")
//    public ReservationCreateResponseDto createDemo(
//            @RequestBody ReservationCreateRequestDto req
//            ){
//        return reservationUiService.createDemo(req);
//
//    }


}
