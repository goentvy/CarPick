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
        log.info("[changeReservation] reservationId={}, newCarId={}", reservationId, request.getNewCarId());

        try {
            // 1. 현재 예약 정보 조회
            var currentReservation = reservationChangeMapper.getCurrentReservation(reservationId);
            if (currentReservation == null) {
                throw new IllegalArgumentException("존재하지 않는 예약입니다.");
            }

            Long currentVehicleId = currentReservation.getVehicleId();
            Long currentSpecId = currentReservation.getSpecId();

            // 2. 새 차종 정보 조회 (specId → vehicleId 변환)
            var newCarInfo = reservationChangeMapper.findCarBySpecId(request.getNewCarId());
            if (newCarInfo == null) {
                throw new IllegalArgumentException("존재하지 않는 차종입니다: " + request.getNewCarId());
            }
            Long newVehicleId = newCarInfo.getVehicleId();

            // 3. 차량 재고 상태 변경 (기존 차량 해제, 새 차량 예약)
            if (!currentVehicleId.equals(newVehicleId)) {
                // 기존 차량 AVAILABLE로 변경
                reservationChangeMapper.updateVehicleStatus(currentVehicleId, "AVAILABLE");

                // 새 차량 RESERVED로 변경 (중복 예약 방지)
                int updated = reservationChangeMapper.updateVehicleStatus(newVehicleId, "RESERVED");
                if (updated == 0) {
                    throw new IllegalArgumentException("이미 예약된 차량입니다.");
                }
            }

            // 4. 변경 유형 결정
            String changeTypes = detectChangeTypes(currentSpecId, request.getNewCarId(),
                    currentReservation.getStartDate(), request.getNewStartDate());

            // 5. 히스토리 저장 (vehicleId 사용)
            reservationChangeMapper.insertReservationHistory(
                    reservationId,
                    request.getActionType(),
                    changeTypes,
                    request.getOldStartDate(),
                    request.getOldEndDate(),
                    currentVehicleId,  // vehicleId로 저장
                    request.getOldCarName(),
                    "기존 픽업지점",
                    request.getNewStartDate(),
                    request.getNewEndDate(),
                    newVehicleId,      // vehicleId로 저장
                    request.getNewCarName(),
                    "기존 픽업지점",
                    userId
            );

            // 6. 예약 업데이트
            LocalDate newStartDate = LocalDate.parse(request.getNewStartDate());
            LocalDate newEndDate = LocalDate.parse(request.getNewEndDate());
            Integer insuranceId = request.getInsuranceId() != null ? request.getInsuranceId() : 1;

            reservationChangeMapper.updateReservation(
                    reservationId,
                    request.getNewCarId(),   // specId
                    newVehicleId,            // vehicleId 추가
                    newStartDate,
                    newEndDate,
                    request.getNewPrice(),
                    insuranceId
            );

            log.info("[changeReservation] 성공: {}({}) → {}({})",
                    currentReservation.getCarName(), currentVehicleId,
                    request.getNewCarName(), newVehicleId);

            return ReservationChangeResponseDto.builder()
                    .success(true)
                    .reservationId(reservationId)
                    .message("예약이 변경되었습니다.")
                    .build();

        } catch (Exception e) {
            log.error("[changeReservation] 실패: {}", e.getMessage(), e);
            throw new RuntimeException("예약 변경 실패: " + e.getMessage(), e);
        }
    }

    private String detectChangeTypes(Long currentSpecId, Long newSpecId,
                                     LocalDate currentStartDate, String newStartDate) {
        boolean carChanged = !currentSpecId.equals(newSpecId);
        boolean periodChanged = !currentStartDate.toString().equals(newStartDate);
        return (carChanged ? "CAR" : "") + (periodChanged ? ",PERIOD" : "");
    }
}