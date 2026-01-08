// src/main/java/com/carpick/domain/reservation/service/GuestReservationService.java
package com.carpick.domain.reservation.service;

import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GuestReservationService {

    private final ReservationMapper reservationMapper;

    @Transactional
    public String cancelReservation(String email, String reservationNumber, String reason) {
        log.info("비회원 예약 취소 시작: email={}, reservationNumber={}, reason={}",
                email, reservationNumber, reason);

        // 1. 예약 조회
        Reservation reservation = reservationMapper.findByDriverEmailAndReservationNo(email, reservationNumber);
        if (reservation == null) {
            log.warn("예약을 찾을 수 없습니다: email={}, reservationNumber={}", email, reservationNumber);
            return null;
        }

        // 2. 취소 업데이트
        Map<String, Object> params = new HashMap<>();
        params.put("reservationId", reservation.getReservationId());
        params.put("status", "CANCELED");
        params.put("reason", reason);

        int updatedRows = reservationMapper.updateReservationStatusForNonMember(params);
        log.info("예약 취소 완료: reservationId={}, updatedRows={}, reason={}",
                reservation.getReservationId(), updatedRows, reason);

        return updatedRows > 0 ? "예약 취소 완료" : null;
    }
}
