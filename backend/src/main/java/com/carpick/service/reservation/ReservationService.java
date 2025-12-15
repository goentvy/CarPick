package com.carpick.service.reservation;

import com.carpick.dto.reservation.ReservationDto;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {
    public ReservationDto findByEmailAndNumber(String email, String reservationNumber) {
        // DB 조회 로직 (Stub)
        return new ReservationDto(email, reservationNumber, "Carnival High-Limousine", "2025-12-20");
    }

    public ReservationDto cancelReservation(String reservationNumber, String reason) {
        // DB 업데이트 로직 (Stub)
        return new ReservationDto("email.test", reservationNumber, "Carnival High-Limousine", "2025-12-20");
    }
}
