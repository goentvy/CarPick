package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.ReviewResponse;
import com.carpick.domain.member.dto.ReviewUpdateRequest;
import com.carpick.domain.member.service.ReviewService;
import com.carpick.global.security.details.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 기존 마이페이지 API들 (변경 없음)
    @GetMapping("/me")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        System.out.println("### REVIEW /me USER_ID = " + userId);
        List<ReviewResponse> reviews = reviewService.getMyReviews(userId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            HttpServletRequest request,
            @PathVariable Long reviewId,
            @RequestBody ReviewUpdateRequest requestDto) {
        Long userId = getCurrentUserId(request);
        ReviewResponse updatedReview = reviewService.updateReview(userId, reviewId, requestDto);
        return ResponseEntity.ok(updatedReview);
    }

    // 🆕 홈페이지용: 로그인 없이 최신 3개 공개 리뷰
    @GetMapping("/latest")
    @PreAuthorize("permitAll()") // ✅ 공개 API (로그인 X)
    public ResponseEntity<List<ReviewResponse>> getLatestReviews() {
        List<ReviewResponse> latestReviews = reviewService.getLatestReviews(3);
        System.out.println("### HOMEPAGE: Latest reviews count = " + latestReviews.size());
        return ResponseEntity.ok(latestReviews);
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                System.out.println("### PROD MODE: JWT userId = " + userDetails.getUserId());
                return userDetails.getUserId();
            }
        } catch (Exception e) { }

        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            System.out.println("### DEV MODE: X-User-Id = " + userIdHeader);
            return Long.parseLong(userIdHeader);
        }

        throw new IllegalStateException("로그인된 사용자가 없습니다. (X-User-Id 헤더 또는 JWT 필요)");
    }
}
