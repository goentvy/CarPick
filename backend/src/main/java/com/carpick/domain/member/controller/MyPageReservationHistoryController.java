package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.ReservationHistoryResponse;
import com.carpick.domain.member.service.ReservationHistoryService;
import com.carpick.global.security.details.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservationsssssssss")
@RequiredArgsConstructor
public class MyPageReservationHistoryController {

    private final ReservationHistoryService historyService;

    @GetMapping("/history/me")
    public ResponseEntity<List<ReservationHistoryResponse>> getMyHistory(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        System.out.println("### HISTORY /me USER_ID = " + userId);
        List<ReservationHistoryResponse> history = historyService.getMyHistory(userId);
        return ResponseEntity.ok(history);
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        // 1. Prod: JWT 우선
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                System.out.println("### PROD MODE: JWT userId = " + userDetails.getUserId());
                return userDetails.getUserId();
            }
        } catch (Exception e) { }

        // 2. Dev: X-User-Id 헤더
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            System.out.println("### DEV MODE: X-User-Id = " + userIdHeader);
            return Long.parseLong(userIdHeader);
        }

        throw new IllegalStateException("로그인된 사용자가 없습니다. (X-User-Id 헤더 또는 JWT 필요)");
    }
}
