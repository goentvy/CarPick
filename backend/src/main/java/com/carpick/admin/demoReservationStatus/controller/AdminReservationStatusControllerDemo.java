package com.carpick.admin.demoReservationStatus.controller;


import com.carpick.admin.demoReservationStatus.dto.AdminReservationStatusDtoDemo;
import com.carpick.admin.demoReservationStatus.mapper.AdminReservationStatusServiceDemo;
import com.carpick.domain.reservation.enums.ReservationStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/demo/reservations")
@Validated
public class AdminReservationStatusControllerDemo {

    private final AdminReservationStatusServiceDemo service;
    @GetMapping
    public ResponseEntity<List<AdminReservationStatusDtoDemo>> getReservations() {
        return ResponseEntity.ok(service.getReservationList());
    }

    /**
     * 예약 상태 변경
     * PATCH /api/admin/demo/reservations/{reservationId}/status
     */
    @PatchMapping("/{reservationId}/status")
    public ResponseEntity<Void> changeStatus(
            @PathVariable("reservationId") Long reservationId,
            @Valid @RequestBody ChangeStatusRequest request
    ) {
        service.changeStatus(reservationId, request.getStatus());
        return ResponseEntity.noContent().build(); // 204
    }

    @Data
    public static class ChangeStatusRequest {
        @NotNull(message = "status는 필수입니다.")
        private ReservationStatus status;
    }
}
