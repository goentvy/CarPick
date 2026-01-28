package com.carpick.admin.demoReservationStatus.dto;


import com.carpick.domain.reservation.enums.ReservationStatus;
import lombok.Data;

@Data
public class AdminReservationStatusDtoDemo {
    private Long reservationId;          // 내부 식별(편의)
    private String reservationNo;        // 예약번호

    private String modelName;            // CAR_SPEC.model_name (모델명)
    private String vehicleNo;            // VEHICLE_INVENTORY.vehicle_no (차량번호)

    private ReservationStatus reservationStatus; // 예약상태

}
