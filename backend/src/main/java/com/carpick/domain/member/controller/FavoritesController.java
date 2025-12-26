// src/main/java/com/carpick/domain/member/controller/FavoritesController.java
package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.FavoriteRequest;
import com.carpick.domain.member.dto.FavoriteResponse;
import com.carpick.domain.member.service.FavoritesService;
import com.carpick.global.security.details.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorites")
public class FavoritesController {

    private final FavoritesService favoritesService;

    // 1. 내 찜 목록 조회
    @GetMapping("/me")
    public ResponseEntity<List<FavoriteResponse>> getMyFavorites(
            HttpServletRequest request) {

        Long userId = getCurrentUserId(request);  // ✅ LicenseController 패턴!
        log.info("### FAVORITES /me USER_ID = " + userId);

        List<FavoriteResponse> favorites = favoritesService.getMyFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    // 2. 찜 추가
    @PostMapping("/{carId}")
    public ResponseEntity<java.util.Map<String, String>> addFavorite(
            HttpServletRequest request,
            @PathVariable Long carId,
            @RequestBody FavoriteRequest requestBody) {

        Long userId = getCurrentUserId(request);  // ✅ LicenseController 패턴!
        favoritesService.addFavorite(userId, carId, requestBody.getCarName(), requestBody.getCarImageUrl());

        return ResponseEntity.ok(java.util.Map.of("message", "찜 추가 완료"));
    }

    // 3. 찜 삭제
    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<java.util.Map<String, String>> deleteFavorite(
            HttpServletRequest request,
            @PathVariable Long favoriteId) {

        Long userId = getCurrentUserId(request);
        favoritesService.deleteFavorite(userId, favoriteId);

        return ResponseEntity.ok(java.util.Map.of("message", "찜 삭제 완료"));
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        // 1. Prod: JWT → SecurityContext 우선
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                log.info("### PROD MODE: JWT userId = " + userDetails.getUserId());
                return userDetails.getUserId();
            }
        } catch (Exception e) {
            // Dev fallback
            log.warn("JWT 파싱 실패, X-User-Id 헤더로 폴백");
        }

        // 2. Dev: X-User-Id 헤더 (로그인된 ID만)
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            log.info("### DEV MODE: X-User-Id = " + userIdHeader);
            return Long.parseLong(userIdHeader);
        }

        throw new IllegalStateException("로그인된 사용자가 없습니다. (X-User-Id 헤더 또는 JWT 필요)");
    }
}
