package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dtoV2.request.ReservationCreateRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.request.ReservationFormRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.request.ReservationPaymentRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationCreateResponseDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationFormResponseDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationPaymentResponseDtoV2;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.service.v2.ReservationCreateServiceV2;
import com.carpick.domain.reservation.service.v2.ReservationFormServiceV2;
import com.carpick.domain.reservation.service.v2.ReservationPaymentServiceV2;
import com.carpick.domain.reservation.service.v2.ReservationReadServiceV2;
import com.carpick.global.security.details.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final ReservationFormServiceV2 formServiceV2;
    private final ReservationCreateServiceV2 createServiceV2;
    private final ReservationPaymentServiceV2 paymentServiceV2;
    private final ReservationReadServiceV2 readServiceV2;

    /**
     * (1) 예약 폼 데이터 조회
     *
     * 목적:
     * - 예약 페이지(UI)를 구성하기 위한 "초기 데이터"를 내려준다.
     *   (차량 요약, 지점 정보, 보험 옵션, 기본 결제요약 등)
     *
     * 핵심 원칙(중요):
     * - 이 응답은 '화면 렌더링 편의'를 위한 데이터이며,
     *   가격의 진실(source of truth)은 /api/v2/reservations/price(Price API) 또는
     *   ReservationPriceSummaryService 계산 결과에 있다.
     *
     * 책임:
     * - Controller: 요청을 받아 Service 호출 후 응답만 반환 (비즈니스 로직 금지)
     * - Service(FormServiceV2): 차량/지점/보험옵션 조회 + 기본 결제요약 조립
     *
     * 호출 시점:
     * - "차량 상세 → 예약하기"로 진입할 때 최초 1회
     */
    @PostMapping("/form")
    public ResponseEntity<ReservationFormResponseDtoV2> getForm(
            @Valid @RequestBody ReservationFormRequestDtoV2 request
    ) {
        return ResponseEntity.ok(formServiceV2.getReservationForm(request));
    }

    /**
     * (2) 예약 생성 (회원/비회원 모두 가능)
     *
     * 목적:
     * - 사용자가 입력을 완료하고 "예약하기"를 누르는 순간,
     *   예약 엔티티를 생성하고 가격 스냅샷(결제 기준)을 확정한다.
     *
     * 핵심 원칙(가장 중요):
     * - 프런트가 계산한 금액/합계는 신뢰하지 않는다.
     * - 서버에서 ReservationPriceSummaryService로 "가격을 재계산"하고,
     *   그 결과를 Reservation 스냅샷으로 저장한다.
     *
     * 호출 시점:
     * - 예약 정보 입력(운전자/보험/약관 등) 완료 후 "예약 생성" 단계
     *
     * 반환값:
     * - reservationNo (이후 결제 API에서 필수)
     */
    @PostMapping("/create")
    public ResponseEntity<ReservationCreateResponseDtoV2> create(
            @Valid @RequestBody ReservationCreateRequestDtoV2 request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("[create] insuranceCode={}, rentType={}", request.getInsuranceCode(), request.getRentType());
        log.info("[create] uri=/api/reservation/create insuranceCode={}, rentType={}",
                request.getInsuranceCode(), request.getRentType());
        // 회원이면 userId 세팅, 비회원이면 null
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        // 생성 성공 시 응답 반환
        // (권장: 생성 API는 보통 201 Created가 더 REST스럽지만, 현재는 200 OK로 통일되어 있음)
        return ResponseEntity.ok(createServiceV2.createReservation(request, userId));
    }
    // (3) 결제 처리 / (4) 예약 조회 등도 같은 철학으로 이어짐:
    // - 결제는 반드시 create에서 확정된 reservationNo + 스냅샷 금액 기준으로 처리
    // - 조회는 readServiceV2에서 화면 표시용 DTO로 조립
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
