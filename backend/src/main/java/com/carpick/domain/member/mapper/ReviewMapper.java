package com.carpick.domain.member.mapper;

import com.carpick.domain.member.dto.ReviewResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewMapper {
    List<ReviewResponse> findByUserId(Long userId);
    ReviewResponse findById(Long reviewId);
    ReviewResponse findByIdAndUserId(Long userId, Long reviewId);
    void updateReview(Long reviewId, Double rating, String content);
    List<ReviewResponse> findLatestReviews(@Param("limit") int limit);
}
