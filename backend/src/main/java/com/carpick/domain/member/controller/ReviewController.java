package com.carpick.domain.member.controller;

import com.carpick.domain.member.dto.ReviewResponse;
import com.carpick.domain.member.dto.ReviewUpdateRequest;
import com.carpick.domain.member.service.ReviewService;
import com.carpick.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtProvider jwtProvider;  // ← License와 동일!

    @GetMapping("/me")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(
            @RequestHeader("Authorization") String authorizationHeader) {  // ← License와 동일!

        Long userId = extractUserId(authorizationHeader);  // ← License와 동일!
        System.out.println("### REVIEW /me USER_ID = " + userId);  // 실제 user_id!

        List<ReviewResponse> reviews = reviewService.getMyReviews(userId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody ReviewUpdateRequest request) {

        Long userId = extractUserId(authorizationHeader);  // ← License와 동일!
        ReviewResponse updatedReview = reviewService.updateReview(userId, reviewId, request);
        return ResponseEntity.ok(updatedReview);
    }

    private Long extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
        }
        String token = authorizationHeader.substring(7); // "Bearer " 이후
        return jwtProvider.getUserId(token);
    }
}
