package com.carpick.domain.reservationHistory.controller;

import com.carpick.domain.reservationHistory.entity.ReservationStatusHistory;
import com.carpick.domain.reservationHistory.service.ReservationStatusHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationHistoryController {
    private final ReservationStatusHistoryService historyService;

    /**
     * 특정 예약의 변경 이력 조회
     * GET /api/reservations/{reservationId}/history
     */
    @GetMapping("/{reservationId}/history")
    public ResponseEntity<List<ReservationStatusHistory>> getReservationHistory(
            @PathVariable("reservationId") Long reservationId) {

        List<ReservationStatusHistory> histories = historyService.getHistoryList(reservationId);
        return ResponseEntity.ok(histories);
    }
}
