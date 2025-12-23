package com.carpick.domain.reservation.service;

import com.carpick.domain.reservation.dto.ReservationDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ReservationService {
    public ReservationDto findByEmailAndNumber(String email, String reservationNumber) {
        // DB 조회 로직 (Stub)
        LocalDate today = LocalDate.now();
        return new ReservationDto(email, reservationNumber, "Carnival High-Limousine", today);
    }

    public ReservationDto cancelReservation(String email, String reservationNumber, String reason) {
        // DB 업데이트 로직 (Stub)
        LocalDate today = LocalDate.now();
        return new ReservationDto(email, reservationNumber, "Carnival High-Limousine", today);
    }
}
