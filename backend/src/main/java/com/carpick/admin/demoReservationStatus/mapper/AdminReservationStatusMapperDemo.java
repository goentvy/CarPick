package com.carpick.admin.demoReservationStatus.mapper;

import com.carpick.admin.demoReservationStatus.dto.AdminReservationStatusDtoDemo;
import com.carpick.domain.reservation.enums.ReservationStatus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminReservationStatusMapperDemo {
    int updateReservationStatus(@Param("reservationId") Long reservationId,
                                @Param("status") ReservationStatus status);

    List<AdminReservationStatusDtoDemo> selectReservationList();
}
