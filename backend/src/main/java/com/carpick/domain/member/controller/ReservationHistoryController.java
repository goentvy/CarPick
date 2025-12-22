// src/main/java/com/carpick/domain/reservation/controller/ReservationHistoryController.java
package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.ReservationHistoryResponse;
import com.carpick.domain.member.service.ReservationHistoryService;
import com.carpick.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationHistoryController {

    private final ReservationHistoryService historyService;
    private final JwtProvider jwtProvider;

    @GetMapping("/history/me")
    public ResponseEntity<List<ReservationHistoryResponse>> getMyHistory(
            @RequestHeader("Authorization") String authorizationHeader) {

        Long userId = extractUserId(authorizationHeader);
        System.out.println("### HISTORY /me USER_ID = " + userId);

        List<ReservationHistoryResponse> history = historyService.getMyHistory(userId);
        return ResponseEntity.ok(history);
    }

    private Long extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더 없음");
        }
        String token = authorizationHeader.substring(7);
        return jwtProvider.getUserId(token);
    }
}
