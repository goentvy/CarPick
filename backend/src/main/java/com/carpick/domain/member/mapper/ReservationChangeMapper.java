package com.carpick.domain.member.mapper;

import com.carpick.domain.member.dto.ReservationHistoryResponse;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ReservationChangeMapper {

    // XML에 위임 (Java에서 제거)
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

    // ✅ WHERE r.reservation_id 로 최종 수정!
    @Select({
            "SELECT cs.spec_id ",
            "FROM reservation r ",
            "JOIN vehicle_inventory vi ON r.vehicle_id = vi.vehicle_id ",
            "JOIN car_spec cs ON vi.spec_id = cs.spec_id ",
            "WHERE r.reservation_id = #{reservationId}"  // ← 여기가 핵심!
    })
    Long getCurrentCarId(@Param("reservationId") Long reservationId);

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
