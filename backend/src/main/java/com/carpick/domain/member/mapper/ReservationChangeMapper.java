package com.carpick.domain.member.mapper;

import com.carpick.domain.member.dto.CarInfoDto;
import com.carpick.domain.member.dto.CurrentReservationDto;
import com.carpick.domain.member.dto.ReservationHistoryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface ReservationChangeMapper {

    // 현재 예약 정보 조회
    CurrentReservationDto getCurrentReservation(@Param("reservationId") Long reservationId);

    // specId로 차량 정보 조회
    CarInfoDto findCarBySpecId(@Param("specId") Long specId);

    // 차량 상태 업데이트
    int updateVehicleStatus(@Param("vehicleId") Long vehicleId, @Param("status") String status);

    // 히스토리 저장
    void insertReservationHistory(
            @Param("reservationId") Long reservationId,
            @Param("actionType") String actionType,
            @Param("changeTypes") String changeTypes,
            @Param("oldStartDate") String oldStartDate,
            @Param("oldEndDate") String oldEndDate,
            @Param("oldCarId") Long oldCarId,
            @Param("oldCarName") String oldCarName,
            @Param("oldLocation") String oldLocation,
            @Param("newStartDate") String newStartDate,
            @Param("newEndDate") String newEndDate,
            @Param("newCarId") Long newCarId,
            @Param("newCarName") String newCarName,
            @Param("newLocation") String newLocation,
            @Param("userId") Long userId
    );
    void updateReservation(
            @Param("reservationId") Long reservationId,
            @Param("specId") Long specId,
            @Param("vehicleId") Long vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("totalAmount") Long totalAmount,
            @Param("insuranceId") Integer insuranceId
    );


    @Select("SELECT id, reservation_id as reservationId, " +
            "action_type as actionType, change_types as changeTypes, " +
            "old_car_name as oldCarName, DATE_FORMAT(old_start_date, '%Y-%m-%d') as oldStartDate, " +
            "DATE_FORMAT(old_end_date, '%Y-%m-%d') as oldEndDate, old_location as oldLocation, " +
            "new_car_name as newCarName, DATE_FORMAT(new_start_date, '%Y-%m-%d') as newStartDate, " +
            "DATE_FORMAT(new_end_date, '%Y-%m-%d') as newEndDate, new_location as newLocation, " +
            "reason, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as createdAt " +
            "FROM reservation_history WHERE reservation_id = #{reservationId} " +
            "ORDER BY created_at DESC")
    List<ReservationHistoryResponse> getReservationHistory(@Param("reservationId") Long reservationId);
}
