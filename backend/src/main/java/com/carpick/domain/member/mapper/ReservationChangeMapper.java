package com.carpick.domain.member.mapper;

import com.carpick.domain.member.dto.ReservationHistoryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ReservationChangeMapper {

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
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("totalAmount") Long totalAmount,
            @Param("insuranceId") Integer insuranceId
    );

    // ✅ 핵심만 조회 (컴파일 에러 해결)
    @Select("SELECT spec_id FROM reservation WHERE id = #{reservationId}")
    Long getCurrentCarId(@Param("reservationId") Long reservationId);

    // 히스토리 조회
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
