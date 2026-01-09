package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dto.CancelRequest;
import com.carpick.domain.reservation.dto.GuestReservationDto;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import com.carpick.domain.reservation.service.GuestReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guest/reservation")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class GuestReservationController {

    private final GuestReservationService guestReservationService;
    private final ReservationMapper reservationMapper;  // 조회용 mapper 주입

    @GetMapping
    public ResponseEntity<GuestReservationDto> getReservation(
            @RequestParam String email,
            @RequestParam String reservationNumber) {
        Reservation reservation = reservationMapper.findByDriverEmailAndReservationNo(email, reservationNumber);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(GuestReservationDto.from(reservation));
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelReservation(@RequestBody CancelRequest request) {
        String result = guestReservationService.cancelReservation(
                request.getEmail(),
                request.getReservationNumber(),
                request.getReason()
        );
        if (result == null) {
            return ResponseEntity.badRequest().body("예약을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(result);
    }
}
