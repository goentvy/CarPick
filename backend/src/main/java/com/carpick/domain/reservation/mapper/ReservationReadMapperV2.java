package com.carpick.domain.reservation.mapper;

import com.carpick.domain.reservation.entity.Reservation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface ReservationReadMapperV2 {
//   [1] 예약 상세 조회 (회원/공통)
//    예약 완료 화면
//     * - 마이페이지 예약 상세
//     * - 결제 완료 후 결과 조회
//    외부 식별자인 reservationNo(예약번호)를 기준으로
//     *   단일 예약(RESERVATION) 정보를 조회
//    "예약하기 폼 조회"와는 역할이 다름
//     * - 이 메서드는 이미 생성된 예약 1건의 상세 조회 전용
    Reservation selectReservationByReservationNo(
            @Param("reservationNo") String reservationNo
    );

    // (비회원 조회)  (기존 코드 유지 - 담당: 임승우)
//    TODO: 리팩토링 시 PaymentMapper로 이동 검토
    int updateReservationStatusForNonMember(@Param("params") Map<String, Object> params);
    Reservation findByDriverEmailAndReservationNo(
            @Param("email") String email,
            @Param("reservationNumber") String reservationNumber
    );
}
