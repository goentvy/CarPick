package com.carpick.domain.reservation.mypage.controller;


import com.carpick.domain.reservation.mypage.dto.ReservationDetailDto;
import com.carpick.domain.reservation.mypage.dto.ReservationListDto;
import com.carpick.domain.reservation.mypage.service.ReservationMyPageService;
import com.carpick.global.security.details.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage/reservations-list")
@Slf4j
public class ReservationMyPageController {
    private final ReservationMyPageService reservationMyPageService;

    /** 내 예약 목록 */
    @GetMapping
    public ResponseEntity<List<ReservationListDto>> getMyReservations(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("mypage reservations userDetails={}", userDetails == null ? null : userDetails.getUserId());
        Long userId = userDetails.getUserId();
        List<ReservationListDto> list = reservationMyPageService.getReservationList(userId);
        return ResponseEntity.ok(list);
    }

    /** 내 예약 상세 */
    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationDetailDto> getMyReservationDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("reservationId") Long reservationId
    ) {
        Long userId = userDetails.getUserId();
        ReservationDetailDto detail = reservationMyPageService.getReservationDetail(userId, reservationId);
        return ResponseEntity.ok(detail);
    }


}
