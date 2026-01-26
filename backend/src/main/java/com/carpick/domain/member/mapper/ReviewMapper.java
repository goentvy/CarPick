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
    List<ReviewResponse> findBySpecId(@Param("specId") Long specId, @Param("limit") int limit);

    // ✅ 리뷰 작성용 - specId 추가
    void createReview(@Param("userId") Long userId, @Param("reservationId") Long reservationId, @Param("specId") Long specId, @Param("carName") String carName, @Param("rating") Double rating, @Param("content") String content);
    ReviewResponse findByReservationId(Long reservationId);

    // ✅ specId 조회 추가
    Long findSpecIdByReservationId(Long reservationId);
}
