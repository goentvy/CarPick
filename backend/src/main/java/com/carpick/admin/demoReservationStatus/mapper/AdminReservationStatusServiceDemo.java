package com.carpick.admin.demoReservationStatus.mapper;

import com.carpick.admin.demoReservationStatus.dto.AdminReservationStatusDtoDemo;
import com.carpick.domain.reservation.enums.ReservationStatus;

import java.util.List;

public interface AdminReservationStatusServiceDemo {

    void changeStatus(Long reservationId, ReservationStatus status);
    List<AdminReservationStatusDtoDemo> getReservationList();

}
