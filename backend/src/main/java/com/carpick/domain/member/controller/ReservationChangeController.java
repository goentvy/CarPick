// ReservationChangeController.java - 완성
package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.ReservationChangeRequestDto;
import com.carpick.domain.member.dto.ReservationChangeResponseDto;
import com.carpick.domain.member.service.ReservationChangeService;
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
    public ResponseEntity<?> changeReservation(
            @PathVariable Long reservationId,
            @Valid @RequestBody ReservationChangeRequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            Long userId = userDetails.getUserId();
            ReservationChangeResponseDto response = reservationChangeService
                    .changeReservation(reservationId, request, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ReservationChangeResponseDto.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (Exception e) {
            log.error("예약 변경 실패: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ReservationChangeResponseDto.builder()
                            .success(false)
                            .message("서버 오류가 발생했습니다.")
                            .build());
        }
    }
}
