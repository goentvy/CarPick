package com.carpick.domain.reservation.mapper;

import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.reservation.entity.Reservation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface ReservationMapper {
//    보험(나중에 보험 mapper 로 이동바람)

    // 활성화된 보험 옵션 전체 조회
    List<InsuranceRawDto> selectInsuranceOptions ();
    // 보험 코드로 단건 조회 (가격 계산용)
    InsuranceRawDto selectInsuranceByCode (@Param("insuranceCode") String code);
    /** 예약 생성 */
    int insertReservation(Reservation reservation);

    /** 예약 단건 조회 (RESERVATION 단독) */
    Reservation selectReservationById(@Param("reservationId") long reservationId);

    Long selectAvailableVehicleIdBySpecId(Long specId);

    /** 예약번호로 조회 (필요 시) */
    Reservation selectReservationByReservationNo(@Param("reservationNo") String reservationNo);

    /**
     * 상태 변경
     * - status = CANCELED 이면 cancelReason/cancelledAt까지 함께 반영
     * - 그 외 상태면 cancel_* 값은 건드리지 않음
     */
    int updateReservationStatus(@Param("reservationId") long reservationId,
                                @Param("status") String status,
                                @Param("cancelReason") String cancelReason);

    /**
     * 차량 중복 예약 체크 (기간 겹침)
     * - CANCELED 제외
     * - 신규 예약: excludeReservationId = null
     * - 변경 예약(자기 자신 제외): excludeReservationId = reservationId
     */
    int countOverlappingReservations(@Param("vehicleId") long vehicleId,
                                     @Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate,
                                     @Param("excludeReservationId") Long excludeReservationId);


}
