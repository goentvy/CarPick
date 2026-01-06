package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dto.ReservationRequest;
import com.carpick.domain.reservation.dto.ReservationRequest.CardPayment;
import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.dto.request.ReservationPaymentRequestDto;
import com.carpick.domain.reservation.dto.request.ReservationPriceRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationCreateResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationFormResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPayResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import com.carpick.domain.reservation.service.ReservationCommandService;
import com.carpick.domain.reservation.service.ReservationPaymentCommandService;
import com.carpick.domain.reservation.service.ReservationUiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationUiService reservationUiService;
    private final ReservationCommandService reservationCommandService;

    // ▼▼▼ [핵심] 이 줄이 없어서 에러가 났던 겁니다. 추가해주세요! ▼▼▼
    private final ReservationPaymentCommandService paymentService;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/pay")
    public ResponseEntity<ReservationPayResponseDto> processPayment(
            @Valid @RequestBody ReservationPaymentRequestDto request) {
        Long userId = 1L; // 임시 유저 ID

        // ✅ 방금 만드신 Service의 pay 메서드 호출!
        ReservationPayResponseDto response = paymentService.pay(request, userId);

        return ResponseEntity.ok(response);
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
    @PostMapping("/create")
    public ResponseEntity<ReservationCreateResponseDto> create(
            @RequestBody @Valid ReservationCreateRequestDto req
    ) {
        Long userId = 1L; // 임시 유저 ID
        ReservationCreateResponseDto response = reservationCommandService.createReservation(req, userId);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/{reservationId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelReservation(
            @PathVariable Long reservationId,
            @RequestBody Map<String, String> request) {

        try {
            Long userId = 1L;

            // 1. RESERVATION 상태 변경
            jdbcTemplate.update(
                    "UPDATE RESERVATION SET reservation_status = 'CANCELED', cancel_reason = ? WHERE reservation_id = ?",
                    request.get("reason"), reservationId
            );

            // 2. reservation_history INSERT
            jdbcTemplate.update(
                    """
                    INSERT INTO reservation_history (
                        reservation_id, action_type, old_start_date, old_end_date,
                        old_car_name, reason, user_id
                    ) VALUES (?, 'CANCEL', ?, ?, ?, ?, ?)
                    """,
                    reservationId,
                    request.get("old_start_date"),
                    request.get("old_end_date"),
                    request.get("old_car_name"),
                    request.get("reason"),
                    userId
            );

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false));
        }
    }


}
