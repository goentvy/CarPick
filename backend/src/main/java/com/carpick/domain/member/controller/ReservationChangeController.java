package com.carpick.domain.reservation.controller;

import com.carpick.domain.reservation.dto.request.ReservationChangeRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationChangeResponseDto;
import com.carpick.domain.reservation.service.ReservationChangeService;
import com.carpick.global.security.details.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@Slf4j
public class ReservationChangeController {

    private final ReservationChangeService reservationChangeService;

    @PostMapping("/{reservationId}/change")
    public ResponseEntity<ReservationChangeResponseDto> changeReservation(
            @PathVariable Long reservationId,
            @Valid @RequestBody ReservationChangeRequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        ReservationChangeResponseDto response = reservationChangeService.changeReservation(reservationId, request, userId);
        return ResponseEntity.ok(response);
    }
}
