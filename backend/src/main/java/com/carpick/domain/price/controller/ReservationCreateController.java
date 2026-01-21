package com.carpick.domain.price.controller;


import com.carpick.domain.reservation.dtoV2.request.ReservationCreateRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationCreateResponseDtoV2;
import com.carpick.domain.reservation.service.v2.ReservationCreateServiceV2;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/reservations/create")
@RequiredArgsConstructor
public class ReservationCreateController {
    private final ReservationCreateServiceV2 reservationCreateService;

    @PostMapping
    public ResponseEntity<ReservationCreateResponseDtoV2> createReservation(
            @RequestBody @Valid ReservationCreateRequestDtoV2 request,
            @RequestParam(required = false) Long userId
    ) {
        ReservationCreateResponseDtoV2 response = reservationCreateService.createReservation(request, userId);
        return ResponseEntity.status(201).body(response);
    }

}
