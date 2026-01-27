// ReservationChangeService.java (최종)
package com.carpick.domain.member.service;

import com.carpick.domain.member.dto.ReservationChangeRequestDto;
import com.carpick.domain.member.dto.ReservationChangeResponseDto;
import com.carpick.domain.member.mapper.ReservationChangeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationChangeService {

    private final ReservationChangeMapper reservationChangeMapper;

    @Transactional
    public ReservationChangeResponseDto changeReservation(
            Long reservationId,
            ReservationChangeRequestDto request,
            Long userId
    ) {
        log.info("[changeReservation] reservationId={}, userId={}", reservationId, userId);

        try {
            // 1. 현재 차량 ID 조회 (에러 없음!)
            Long currentCarId = reservationChangeMapper.getCurrentCarId(reservationId);
            if (currentCarId == null) {
                throw new IllegalArgumentException("존재하지 않는 예약입니다.");
            }

            // 2. 변경 유형 결정
            String changeTypes = detectChangeTypes(currentCarId, request);

            // 3. 히스토리 저장
            reservationChangeMapper.insertReservationHistory(
                    reservationId,
                    request.getActionType(),
                    changeTypes,
                    request.getOldStartDate(),
                    request.getOldEndDate(),
                    currentCarId,
                    request.getOldCarName(),
                    "기존 픽업지점",  // 프론트에서 고정
                    request.getNewStartDate(),
                    request.getNewEndDate(),
                    request.getNewCarId(),
                    request.getNewCarName(),
                    "기존 픽업지점",
                    userId
            );

            // 4. 예약 업데이트
            LocalDate newStartDate = LocalDate.parse(request.getNewStartDate());
            LocalDate newEndDate = LocalDate.parse(request.getNewEndDate());
            Integer insuranceId = request.getInsuranceId() != null ? request.getInsuranceId() : 1;

            reservationChangeMapper.updateReservation(
                    reservationId,
                    request.getNewCarId(),
                    newStartDate,
                    newEndDate,
                    request.getNewPrice(),
                    insuranceId
            );

            log.info("[changeReservation] 성공: reservationId={}", reservationId);

            return ReservationChangeResponseDto.builder()
                    .success(true)
                    .reservationId(reservationId)
                    .message("예약이 변경되었습니다.")
                    .build();

        } catch (Exception e) {
            log.error("[changeReservation] 실패: {}", e.getMessage(), e);
            return ReservationChangeResponseDto.builder()
                    .success(false)
                    .reservationId(reservationId)
                    .message("예약 변경 실패: " + e.getMessage())
                    .build();
        }
    }

    private String detectChangeTypes(Long currentCarId, ReservationChangeRequestDto request) {
        boolean carChanged = !currentCarId.equals(request.getNewCarId());
        return carChanged ? "CAR,PERIOD" : "PERIOD";
    }
}
