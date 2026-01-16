package com.carpick.domain.reservation.mapper;

import com.carpick.domain.payment.vo.PaymentVerificationVo;
import com.carpick.domain.reservation.entity.Reservation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReservationPaymentMapperV2 {
    // [1] 결제 검증(상태/금액/권한) 최소 정보 + row lock(FOR UPDATE)
    PaymentVerificationVo selectPaymentInfoForUpdate(@Param("reservationNo") String reservationNo);


    /**
     * [2] 결제 확정: 조건부 상태 전이(멱등)
     * - 예: PENDING -> CONFIRMED
     * - 이미 CONFIRMED면 0 rows (멱등 처리)
     */
    int updateStatusIfCurrent(
            @Param("reservationId") long reservationId,
            @Param("expectedStatus") String expectedStatus,
            @Param("nextStatus") String nextStatus
    );

    /**
     * [3] 결제 실패/검증 실패 등으로 예약 취소 처리(시스템 취소 포함)
     * - cancelReason을 DB에 남겨 QA/운영 추적 가능
     * - 취소 담당이 아니어도 "결제 실패로 인한 취소"는 결제 파트에서 발생 가능
     */
    int updateStatusToCanceled(
            @Param("reservationId") long reservationId,
            @Param("cancelReason") String cancelReason
    );
}
