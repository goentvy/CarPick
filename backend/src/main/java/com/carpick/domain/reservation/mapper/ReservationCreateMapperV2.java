package com.carpick.domain.reservation.mapper;

import com.carpick.domain.reservation.entity.Reservation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;

@Mapper
public interface ReservationCreateMapperV2 {
//예약생성 mapper
//    [1] 예약 가능 실차 1대 선택
//    countOverlappingReservations:예약 기간 겹침 여부 검증 과  겹칠수 있음
//    그래서 서비스에서 selectAvailableVehicleIdForPeriod 이걸로 검증한걸 countOverlappingReservations으로 다시 확인해야함
    Long selectAvailableVehicleIdForPeriod(
            @Param("pickupBranchId") Long pickupBranchId,
            @Param("specId") Long specId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
//[2] 차량 재고 Row Lock 획득 (비관적 락)
//    반드시 @Transactional 범위 안에서 호출되어야 함
//     반환값은 중요하지 않으며, "락 획득" 자체가 목적
    Long lockVehicleInventory(@Param("vehicleId") long vehicleId);
//[3] 예약 기간 겹침 여부 검증
//    비관적 락 + 기간 겹침 검증을 함께 사용하여
//       논리적 정합성 + 물리적 정합성을 동시에 확보
//    0이면 예약 가능
    int countOverlappingReservations(
            @Param("vehicleId") long vehicleId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
//[4] 예약 생성 (INSERT)
//    모든 검증이 끝난 뒤
//      - 실제 예약을 DB에 확정적으로 기록하는 단계
//    ▶ 구현 권장 사항
//     * - XML에서 useGeneratedKeys="true"
//     *   keyProperty="reservationId" 설정
//     * - INSERT 후 reservation.getReservationId()로
//     *   PK 접근 가능하도록 구성
    int insertReservation(Reservation reservation);
}
