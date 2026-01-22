package com.carpick.domain.member.service;

import com.carpick.domain.member.dto.ReservationChangeRequestDto;
import com.carpick.domain.member.dto.ReservationChangeResponseDto;
import com.carpick.domain.member.mapper.ReservationChangeMapper;
import com.carpick.domain.reservation.entity.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReservationChangeService {

    private final ReservationChangeMapper reservationChangeMapper;

    public ReservationChangeResponseDto changeReservation(
            Long reservationId,
            ReservationChangeRequestDto request,
            Long userId
    ) {
        log.info("[changeReservation] reservationId={}, userId={}", reservationId, userId);

        // 1. 변경 기록 저장
        reservationChangeMapper.insertReservationHistory(
                reservationId,
                request.getActionType(),
                request.getOldStartDate(),
                request.getOldEndDate(),
                request.getOldCarName(),
                request.getOldPrice(),
                request.getNewStartDate(),
                request.getNewEndDate(),
                request.getNewCarName(),
                request.getNewPrice(),
                request.getPriceDifference(),
                userId
        );

        // 2. 예약 정보 업데이트
        LocalDate newStartDate = LocalDate.parse(request.getNewStartDate());
        LocalDate newEndDate = LocalDate.parse(request.getNewEndDate());

        reservationChangeMapper.updateReservation(
                reservationId,
                request.getNewCarId(),
                newStartDate,
                newEndDate,
                request.getNewPrice()
        );

        log.info("[changeReservation] 예약 변경 완료: reservationId={}", reservationId);

        return ReservationChangeResponseDto.builder()
                .success(true)
                .reservationId(reservationId)
                .message("예약이 변경되었습니다.")
                .build();
    }
}
