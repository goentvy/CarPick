package com.carpick.domain.member.service;

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

    // ✅ 기존 마이페이지 리뷰 조회
    public List<ReviewResponse> getMyReviews(Long userId) {
        return reviewMapper.findByUserId(userId);
    }

    // ✅ 기존 리뷰 수정
    @Transactional
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewUpdateRequest request) {
        ReviewResponse existingReview = reviewMapper.findByIdAndUserId(userId, reviewId);
        if (existingReview == null) {
            throw new IllegalArgumentException("수정 권한이 없는 리뷰입니다.");
        }
        reviewMapper.updateReview(reviewId, request.getRating(), request.getContent());
        return reviewMapper.findById(reviewId);
    }

    //  홈페이지용 최신 리뷰
    public List<ReviewResponse> getLatestReviews(int limit) {
        return reviewMapper.findLatestReviews(limit); // Mapper 메서드 직접 호출
    }

    //  차량 상세 페이지: spec_id별 리뷰 (최근순)
    public List<ReviewResponse> getReviewsBySpecId(Long specId, int limit) {
        return reviewMapper.findBySpecId(specId, limit);
    }
}
