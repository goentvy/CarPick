package com.carpick.domain.member.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

@Mapper
public interface ReservationChangeMapper {

    void insertReservationHistory(
            @Param("reservationId") Long reservationId,
            @Param("actionType") String actionType,
            @Param("oldStartDate") String oldStartDate,
            @Param("oldEndDate") String oldEndDate,
            @Param("oldCarName") String oldCarName,
            @Param("oldPrice") Integer oldPrice,
            @Param("newStartDate") String newStartDate,
            @Param("newEndDate") String newEndDate,
            @Param("newCarName") String newCarName,
            @Param("newPrice") Integer newPrice,
            @Param("priceDifference") Integer priceDifference,
            @Param("userId") Long userId
    );

    void updateReservation(
            @Param("reservationId") Long reservationId,
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("totalAmount") Integer totalAmount
    );
}
