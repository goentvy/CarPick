package com.carpick.domain.reservation.service;


import com.carpick.domain.reservation.dto.ReservationRequest;
import com.carpick.domain.reservation.dto.request.ReservationPaymentRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationPayResponseDto;
import com.carpick.domain.reservation.enums.ActorType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import com.carpick.domain.reservationHistory.entity.ReservationStatusHistory;
import com.carpick.domain.reservationHistory.mapper.ReservationStatusHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationPaymentCommandService {

    private final ReservationMapper reservationMapper;
    private final ReservationStatusHistoryMapper historyMapper;

    @Transactional
    public ReservationPayResponseDto pay(ReservationPaymentRequestDto  req, Long userId) {




            // 0) reservationNo 필수 (프론트 기준 키)
            if (req.getReservationNo() == null || req.getReservationNo().isBlank()) {
                throw new IllegalArgumentException("reservationNo가 누락되었습니다.");
            }

            // 1) mock 결제 승인 (팀장 로직 유지)
            if (!mockPaymentCheck(req.getCardPayment())) {
                throw new IllegalArgumentException("결제 승인이 거절되었습니다.");
            }

            // 2) reservationId 확보 (reservationNo -> reservationId)
            Long reservationId = reservationMapper.selectReservationIdByReservationNo(req.getReservationNo());
            if (reservationId == null) {
                throw new IllegalArgumentException("예약을 찾을 수 없습니다. reservationNo=" + req.getReservationNo());
            }

            // 3) 현재 상태 조회
            String currStatus = reservationMapper.selectReservationStatusById(reservationId);
            if (currStatus == null) {
                throw new IllegalArgumentException("예약 상태를 조회할 수 없습니다. reservationId=" + reservationId);
            }

            // 멱등 처리
            if (ReservationStatus.CONFIRMED.name().equals(currStatus)) {
                return new ReservationPayResponseDto("APPROVED", "이미 결제 완료된 예약입니다.", req.getReservationNo());
            }

            // 결제 가능한 상태만 허용
            if (!ReservationStatus.PENDING.name().equals(currStatus)) {
                throw new IllegalStateException("결제 불가능한 상태입니다: " + currStatus);
            }

            // 4) 상태 변경
            int updated = reservationMapper.updateReservationStatus(
                    reservationId,
                    ReservationStatus.CONFIRMED.name(),
                    null
            );
            if (updated != 1) {
                throw new IllegalStateException("예약 상태 변경 실패. reservationId=" + reservationId);
            }

            // 5) 히스토리
            historyMapper.insertHistory(
                    ReservationStatusHistory.builder()
                            .reservationId(reservationId)
                            .statusPrev(ReservationStatus.valueOf(currStatus))
                            .statusCurr(ReservationStatus.CONFIRMED)
                            .actorType(ActorType.USER)
                            .actorId(String.valueOf(userId))
                            .reason("결제 승인 (Mock)")
                            .build()
            );

            return new ReservationPayResponseDto("APPROVED", "결제가 정상적으로 완료되었습니다.", req.getReservationNo());
        }




    // 팀장 로직 이식
    private boolean mockPaymentCheck(ReservationPaymentRequestDto.CardPayment card) {
        return card != null
                && card.getCardNumber() != null
                && card.getCardNumber().startsWith("1234");
    }
}
