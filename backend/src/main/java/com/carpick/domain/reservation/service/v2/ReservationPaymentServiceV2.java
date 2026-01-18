package com.carpick.domain.reservation.service.v2;

import com.carpick.domain.payment.enums.PayStatus;
import com.carpick.domain.payment.vo.PaymentVerificationVo;
import com.carpick.domain.reservation.dtoV2.request.ReservationPaymentRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationPaymentResponseDtoV2;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.mapper.ReservationPaymentMapperV2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReservationPaymentServiceV2 {
    private final ReservationPaymentMapperV2 paymentMapper;

    /**
     * 결제 처리 메인
     *
     * 처리 흐름:
     * 1) reservationNo로 예약 Row를 FOR UPDATE로 조회 (동시 결제 방지)
     * 2) 예약 상태/권한 검증 (PENDING만 결제 가능)
     * 3) Mock PG 결제 체크 (카드번호 1234* 만 승인)
     * 4) 조건부 상태 전이 (PENDING -> CONFIRMED)
     * 5) 응답 반환
     *
     * @param request 결제 요청 DTO (reservationNo + 카드정보)
     * @param userId  로그인 사용자 ID (비회원이면 null)
     */
    @Transactional
    public ReservationPaymentResponseDtoV2 processPayment(
            ReservationPaymentRequestDtoV2 request,
            Long userId
    ) {
        // ------------------------------
        // 0) 입력 방어 (Controller @Valid 미적용 가능성 대비)
        // ------------------------------
        if (request == null || request.getReservationNo() == null || request.getReservationNo().isBlank()) {
            return buildFailResponse(null, PayStatus.ERROR);
        }

        final String reservationNo = request.getReservationNo();

        // ============================================================
        // 1) 예약 정보 조회 + Row Lock (FOR UPDATE)
        //
        // - 같은 reservationNo에 대해 결제 요청이 동시에 들어오면,
        //   첫 트랜잭션이 row lock을 잡고, 나머지는 대기하게 됩니다.
        // - 이렇게 해서 "중복 결제/중복 상태 전이"를 원천적으로 줄입니다.
        // ============================================================
        PaymentVerificationVo verification = paymentMapper.selectPaymentInfoForUpdate(reservationNo);

        if (verification == null) {
            log.warn("[결제실패] 예약 정보 없음. reservationNo={}", reservationNo);
            return buildFailResponse(reservationNo, PayStatus.ERROR);
        }

        log.info("[결제처리] 예약 조회+락 완료. reservationId={}, status={}",
                verification.getReservationId(), verification.getReservationStatus());

        // ============================================================
        // 2) 결제 전 검증
        // ============================================================

        // 2-1) 상태 검증
        // - 결제는 PENDING 상태에서만 가능
        // - 이미 CONFIRMED면 "멱등"하게 성공 응답 반환 (중복 결제 요청이 와도 OK)
        ReservationStatus currStatus = verification.getReservationStatus();
        if (currStatus != ReservationStatus.PENDING) {
            log.warn("[결제불가] 상태가 PENDING이 아님. reservationNo={}, status={}", reservationNo, currStatus);

            if (currStatus == ReservationStatus.CONFIRMED) {
                // 이미 결제가 확정된 상태라면, 동일 요청을 성공으로 처리(멱등)
                return buildSuccessResponse(reservationNo);
            }
            // 그 외(CANCELED/ACTIVE/COMPLETED 등)는 실패 처리
            return buildFailResponse(reservationNo, PayStatus.ERROR);
        }

        // 2-2) 권한 검증 (회원일 때만)
        // - 회원 결제 요청인데 다른 사람 예약(userId mismatch)을 결제하려 하면 차단
        // - 비회원(userId == null)은 여기서 별도 검증을 안 함 (MVP 정책)
        if (userId != null && verification.getUserId() != null && !userId.equals(verification.getUserId())) {
            log.warn("[결제실패] 권한 없음. requestUserId={}, reservationUserId={}", userId, verification.getUserId());
            return buildFailResponse(reservationNo, PayStatus.ERROR);
        }

        // ============================================================
        // 3) Mock PG 결제 처리 (팀장 로직 이식)
        //
        // - 팀장 규칙:
        //   카드번호가 "1234"로 시작하면 승인, 아니면 거절
        //
        // - 실 PG 연동 시:
        //   이 부분을 PG 승인 API 호출/응답 검증 로직으로 교체하면 됩니다.
        // ============================================================
        boolean approved = mockPaymentCheck(request.getCardPayment());

        if (!approved) {
            log.warn("[결제거절] Mock 결제 거절. reservationNo={}, cardNumber={}",
                    reservationNo,
                    (request.getCardPayment() != null ? request.getCardPayment().getCardNumber() : null)
            );

            // 현재 정책: 결제 실패 시 예약을 취소 처리(CANCELED)
            // - 재시도 정책을 원하면 여기서 CANCELED 처리 대신 PENDING 유지로 바꾸면 됩니다.
            paymentMapper.updateStatusToCanceled(
                    verification.getReservationId(),
                    "결제 실패(Mock): 카드 승인 거절"
            );

            return buildFailResponse(reservationNo, PayStatus.DECLINED);
        }

        log.info("[결제승인] Mock 결제 승인. reservationNo={}, amountSnapshot={}",
                reservationNo, verification.getTotalAmountSnapshot());

        // ============================================================
        // 4) 예약 상태 변경 (PENDING -> CONFIRMED)
        //
        // - updateStatusIfCurrent는 WHERE절에 reservation_status = expectedStatus 조건이 있어서
        //   동시에 누가 먼저 바꿔버리면 0 rows가 됩니다.
        // - 즉, DB 레벨에서 멱등/경쟁 상태를 깔끔하게 처리할 수 있습니다.
        // ============================================================
        int updatedRows = paymentMapper.updateStatusIfCurrent(
                verification.getReservationId(),
                ReservationStatus.PENDING,
                ReservationStatus.CONFIRMED
        );

        if (updatedRows == 0) {
            // 동시 요청으로 이미 다른 트랜잭션이 CONFIRMED로 바꾼 경우
            log.info("[멱등처리] 이미 처리된 예약. reservationNo={}", reservationNo);
            return buildSuccessResponse(reservationNo);
        }

        log.info("[결제완료] 예약 확정 완료. reservationNo={}, reservationId={}",
                reservationNo, verification.getReservationId());

        // ============================================================
        // 5) 응답 반환
        // ============================================================
        return buildSuccessResponse(reservationNo);
    }

    /**
     * 팀장 Mock 결제 로직 이식
     *
     * 승인 조건:
     * - card != null
     * - cardNumber != null
     * - cardNumber startsWith "1234"
     *
     * 주의:
     * - 실제 PG 연동이면 카드번호로 승인 여부를 판단하지 않습니다.
     * - MVP/QA 단계에서 성공/실패 케이스를 쉽게 재현하기 위한 장치입니다.
     */
    private boolean mockPaymentCheck(ReservationPaymentRequestDtoV2.CardPaymentV2 card) {
        return card != null
                && card.getCardNumber() != null
                && card.getCardNumber().startsWith("1234");
    }

    // ============================================================
    // Response Builder
    // ============================================================

    /**
     * 성공 응답 생성
     * - 프론트는 status == APPROVED면 성공 플로우(완료 페이지/마이페이지 이동)를 태우면 됩니다.
     */
    private ReservationPaymentResponseDtoV2 buildSuccessResponse(String reservationNo) {
        ReservationPaymentResponseDtoV2 response = new ReservationPaymentResponseDtoV2();
        response.setStatus(PayStatus.APPROVED);
        response.setReservationNo(reservationNo);
        return response;
    }

    /**
     * 실패 응답 생성
     * - 프론트는 status 값으로 토스트/팝업 메시지 분기하면 됩니다.
     */
    private ReservationPaymentResponseDtoV2 buildFailResponse(String reservationNo, PayStatus status) {
        ReservationPaymentResponseDtoV2 response = new ReservationPaymentResponseDtoV2();
        response.setStatus(status);
        response.setReservationNo(reservationNo);
        return response;
    }
}
