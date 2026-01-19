package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.dto.request.ReservationPaymentRequestDto;
import com.carpick.domain.reservation.dto.request.ReservationPriceRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationCreateResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationFormResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPayResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import com.carpick.domain.reservation.dtoV2.request.ReservationCreateRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.request.ReservationFormRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.request.ReservationPaymentRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationCreateResponseDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationFormResponseDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationPaymentResponseDtoV2;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.service.v1.ReservationCommandServiceV1;
import com.carpick.domain.reservation.service.v1.ReservationPaymentCommandServiceV1;
import com.carpick.domain.reservation.service.v1.ReservationUiServiceV1;
import com.carpick.domain.reservation.service.v2.ReservationCreateServiceV2;
import com.carpick.domain.reservation.service.v2.ReservationFormServiceV2;
import com.carpick.domain.reservation.service.v2.ReservationPaymentServiceV2;
import com.carpick.domain.reservation.service.v2.ReservationReadServiceV2;
import com.carpick.global.security.details.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {



    private final ReservationUiServiceV1 reservationUiServiceV1;
    private final ReservationCommandServiceV1 reservationCommandServiceV1;

    // ▼▼▼ [핵심] 이 줄이 없어서 에러가 났던 겁니다. 추가해주세요! ▼▼▼
    private final ReservationPaymentCommandServiceV1 paymentServiceV1;

    private final ReservationFormServiceV2 formServiceV2;
    private final ReservationCreateServiceV2 createServiceV2;
    private final ReservationPaymentServiceV2 paymentServiceV2;
    private final ReservationReadServiceV2 readServiceV2;

    /**
     * (1) 예약 폼 데이터 조회
     * GET /api/v2/reservation/form?specId=1&pickupBranchId=2&startDateTime=...&endDateTime=...&rentType=SHORT
     *
     * ※ 현재 DTO가 @RequestBody 기반이면 @PostMapping으로 바꾸는 게 제일 깔끔합니다.
     *    하지만 "경로만 수정"이 목표면, 프런트 호출 방식에 맞춰 아래 둘 중 하나로 고정하세요.
     */
    @PostMapping("/form")
    public ResponseEntity<ReservationFormResponseDtoV2> getForm(
            @Valid @RequestBody ReservationFormRequestDtoV2 request
    ) {
        return ResponseEntity.ok(formServiceV2.getReservationForm(request));
    }

    /**
     * (2) 예약 생성 (회원/비회원 모두 가능)
     * POST /api/reservation/create
     */
    @PostMapping("/create")
    public ResponseEntity<ReservationCreateResponseDtoV2> create(
            @Valid @RequestBody ReservationCreateRequestDtoV2 request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("[create] insuranceCode={}, rentType={}", request.getInsuranceCode(), request.getRentType());
        log.info("[create] uri=/api/v2/reservation/create insuranceCode={}, rentType={}",
                request.getInsuranceCode(), request.getRentType());

        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        return ResponseEntity.ok(createServiceV2.createReservation(request, userId));
    }

    /**
     * (3) 결제 처리 (회원/비회원 모두 가능하게 열어두는 버전)
     * POST /api/v2/reservation/pay
     */
    @PostMapping("/pay")
    public ResponseEntity<ReservationPaymentResponseDtoV2> pay(
            @Valid @RequestBody ReservationPaymentRequestDtoV2 request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        return ResponseEntity.ok(paymentServiceV2.processPayment(request, userId));
        // NOTE: MVP 단계에서는 비회원 결제도 허용(예약번호 기반).
// 운영 전환 시: 비회원 결제는 email/password 검증 추가 필요.

    }

    /**
     * (4) 예약 상세 조회 (결제 완료 화면 / 공통)
     * GET /api/reservation/detail/{reservationNo}
     *
     * - 회원이면 본인 검증까지 하고 싶다면 readService.getReservationByNoWithAuth(...)로 변경
     * - 지금은 "경로만 추가"니까 최소로: 그냥 가져오기
     */
    @GetMapping("/detail/{reservationNo}")
    public ResponseEntity<Reservation> detail(
            @PathVariable String reservationNo
    ) {
        return ResponseEntity.ok(readServiceV2.getReservationByNo(reservationNo));
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/v1/pay")
    public ResponseEntity<ReservationPayResponseDto> processPaymentV1(
            @Valid @RequestBody ReservationPaymentRequestDto request,
    @AuthenticationPrincipal CustomUserDetails userDetails ) {
        if(userDetails == null){
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        }
        Long userId = userDetails.getUserId(); // 로그인 유저로 수정

        // ✅ 방금 만드신 Service의 pay 메서드 호출!
        ReservationPayResponseDto response = paymentServiceV1.pay(request, userId);

        return ResponseEntity.ok(response);
    }


    /**
     * 예약 페이지 초기 데이터 내려주기
     * 예: GET /api/v1/reservation/form?carId=1
     */
    @GetMapping("/v1/form")
    public ReservationFormResponseDto getFormV1(@RequestParam("carId") Long carId){
        return reservationUiServiceV1.getForm(carId);

    }
    /**
     * 보험 선택 시 가격 재계산
     * 예: POST /api//v1/reservation/price?carId=1
     * Body: { "insuranceCode": "FULL" }
     */
    @PostMapping("/v1/price")
    public ReservationPriceResponseDto calcPriceV1(@RequestParam("carId") Long carId
            , @RequestBody(required = false) ReservationPriceRequestDto req){
        return reservationUiServiceV1.calcPrice(carId, req);
    }
    @PostMapping("/v1/create")
    public ResponseEntity<ReservationCreateResponseDto> createV1(
            @RequestBody @Valid ReservationCreateRequestDto req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if(userDetails == null){
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        }
        Long userId = userDetails.getUserId(); // 유저 아이디 연동
        ReservationCreateResponseDto response = reservationCommandServiceV1.createReservation(req, userId);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/{reservationId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelReservation(
            @PathVariable Long reservationId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails userDetails
   ) {

        try {
            Long userId = userDetails.getUserId();

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
