package com.carpick.domain.member.service;

import com.carpick.domain.member.dto.ReviewCreateRequest;
import com.carpick.domain.member.dto.ReviewResponse;
import com.carpick.domain.member.dto.ReviewUpdateRequest;
import com.carpick.domain.member.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewMapper reviewMapper;

    public List<ReviewResponse> getMyReviews(Long userId) {
        return reviewMapper.findByUserId(userId);
    }

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewCreateRequest request) {
        // ✅ 1. reservationId로 specId 조회
        Long specId = reviewMapper.findSpecIdByReservationId(request.getReservationId());

        // ✅ 2. specId까지 모두 포함해서 생성
        reviewMapper.createReview(
                userId,
                request.getReservationId(),
                specId,  // ✅ 추가!
                request.getCarName(),
                request.getRating(),
                request.getContent()
        );

        return reviewMapper.findByReservationId(request.getReservationId());
    }

    @Transactional
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewUpdateRequest request) {
        ReviewResponse existingReview = reviewMapper.findByIdAndUserId(userId, reviewId);
        if (existingReview == null) {
            throw new IllegalArgumentException("수정 권한이 없는 리뷰입니다.");
        }
        reviewMapper.updateReview(reviewId, request.getRating(), request.getContent());
        return reviewMapper.findById(reviewId);
    }

    public List<ReviewResponse> getLatestReviews(int limit) {
        return reviewMapper.findLatestReviews(limit);
    }

    public List<ReviewResponse> getReviewsBySpecId(Long specId, int limit) {
        return reviewMapper.findBySpecId(specId, limit);
    }
}
