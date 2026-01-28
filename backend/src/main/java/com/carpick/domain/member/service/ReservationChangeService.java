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
            // 1. 현재 예약 정보 조회 (변경 전 상태)
            var currentReservation = reservationChangeMapper.getCurrentReservation(reservationId);
            if (currentReservation == null) {
                throw new IllegalArgumentException("존재하지 않는 예약입니다.");
            }

            Long currentVehicleId = currentReservation.getVehicleId();
            Long currentSpecId = currentReservation.getSpecId();
            String trueOldCarName = currentReservation.getCarName();  // ✅ 변경 전 정확한 이름

            // 2. 새 차종 정보 조회 (이름 포함!)
            var newCarInfo = reservationChangeMapper.findCarBySpecId(request.getNewCarId());
            if (newCarInfo == null) {
                throw new IllegalArgumentException("존재하지 않는 차종입니다: " + request.getNewCarId());
            }
            Long newVehicleId = newCarInfo.getVehicleId();
            String trueNewCarName = newCarInfo.getCarName();  // ✅ DB 정확한 새 차량명

            log.info("[변경전후 차량] {}({}) → {}({})", trueOldCarName, currentVehicleId, trueNewCarName, newVehicleId);

            // 3. 차량 재고 상태 변경
            if (!currentVehicleId.equals(newVehicleId)) {
                reservationChangeMapper.updateVehicleStatus(currentVehicleId, "AVAILABLE");
                int updated = reservationChangeMapper.updateVehicleStatus(newVehicleId, "RESERVED");
                if (updated == 0) {
                    throw new IllegalArgumentException("이미 예약된 차량입니다.");
                }
            }

            // 4. 변경 유형 결정
            String changeTypes = detectChangeTypes(currentSpecId, request.getNewCarId(),
                    currentReservation.getStartDate(), request.getNewStartDate());

            // 5. 히스토리 저장 (정확한 이름 사용!)
            reservationChangeMapper.insertReservationHistory(
                    reservationId, request.getActionType(), changeTypes,
                    request.getOldStartDate(), request.getOldEndDate(), currentVehicleId,
                    trueOldCarName, "기존 픽업지점",  // ✅ 변경 전 정확한 이름
                    request.getNewStartDate(), request.getNewEndDate(), newVehicleId,
                    trueNewCarName, "기존 픽업지점",  // ✅ DB 새 차량명
                    userId
            );

            // 6. 예약 업데이트
            LocalDate newStartDate = LocalDate.parse(request.getNewStartDate());
            LocalDate newEndDate = LocalDate.parse(request.getNewEndDate());
            Integer insuranceId = request.getInsuranceId() != null ? request.getInsuranceId() : 1;

            reservationChangeMapper.updateReservation(
                    reservationId, request.getNewCarId(), newVehicleId,
                    newStartDate, newEndDate, request.getNewPrice(), insuranceId
            );

            log.info("[changeReservation] 성공: {} → {}", trueOldCarName, trueNewCarName);

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
                                     LocalDate currentStartDate, String newStartDateStr) {
        boolean carChanged = !currentSpecId.equals(newSpecId);
        boolean periodChanged = !currentStartDate.toString().equals(newStartDateStr);
        return (carChanged ? "CAR" : "") + (periodChanged ? ",PERIOD" : "");
    }
}
