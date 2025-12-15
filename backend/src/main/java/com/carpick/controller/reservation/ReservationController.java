package com.carpick.controller.reservation;

import com.carpick.dto.reservation.CancelRequest;
import com.carpick.dto.reservation.ReservationDto;
import com.carpick.service.reservation.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guest/reservation")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
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
                request.getReservationNumber(),
                request.getReason()
        );
        return ResponseEntity.ok(canceled);
    }
}
