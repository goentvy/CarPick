package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dto.CancelRequest;
import com.carpick.domain.reservation.dto.ReservationDto;
import com.carpick.domain.reservation.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guest/reservation")
public class GuestReservationController {

    private final ReservationService reservationService;

    public GuestReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // 조회
    @GetMapping
    public ResponseEntity<ReservationDto> getReservation(
            @RequestParam String email,
            @RequestParam String reservationNumber) {
        ReservationDto reservation = reservationService.findByEmailAndNumber(email, reservationNumber);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reservation);
    }

    // 취소
    @PostMapping("/cancel")
    public ResponseEntity<ReservationDto> cancelReservation(@RequestBody CancelRequest request) {
        ReservationDto canceled = reservationService.cancelReservation(
                request.getEmail(),
                request.getReservationNumber(),
                request.getReason()
        );
        return ResponseEntity.ok(canceled);
    }
}
