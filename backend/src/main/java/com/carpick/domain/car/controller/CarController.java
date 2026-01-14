package com.carpick.domain.car.controller;


import com.carpick.domain.car.dto.carDetailPage.request.CarDetailRequestDto;
import com.carpick.domain.car.dto.carDetailPage.response.CarDetailResponseDtoV2;
import com.carpick.domain.car.dto.carListPage.CarListItemDto;
import com.carpick.domain.car.dto.Legacycardetailpage.LegacyCarDetailResponseDto;
import com.carpick.domain.car.dto.review.ReviewSection;
import com.carpick.domain.car.service.CarDetailServiceV2;
import com.carpick.domain.car.service.CarListService;
import com.carpick.domain.car.service.CarService;
import com.carpick.domain.reservation.enums.RentType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.carpick.domain.member.dto.ReviewResponse;
import com.carpick.domain.member.service.ReviewService;
import java.util.List;


@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;
    private final CarListService carListService;
    private final ReviewService reviewService;
    private final CarDetailServiceV2 carDetailServiceV2;

    //차량상세 (DB 연동)
    @GetMapping("/dddd/{carId}")
    public ResponseEntity<LegacyCarDetailResponseDto> getCarDetail(@PathVariable("carId") Long carId) {
    LegacyCarDetailResponseDto carDetail = carService.getCarDetail(carId);  // ✅ 변수명 수정


    //  리뷰 조회
    List<ReviewResponse> reviews = reviewService.getReviewsBySpecId(carId, 10);
    carDetail.setReviews(reviews);

    return ResponseEntity.ok(carDetail);
}
    // 차량상세 V2 (스펙 중심 + 지점 컨텍스트)
    @GetMapping("/{carId}")
    public ResponseEntity<CarDetailResponseDtoV2> getCarDetailV2(
            @Valid @ModelAttribute CarDetailRequestDto request) {

        CarDetailResponseDtoV2 response = carDetailServiceV2.getCarDetail(
                request.getSpecId(),
                request.getPickupBranchId()
        );

        // 리뷰 조회 후 추가
        List<ReviewResponse> reviews = reviewService.getReviewsBySpecId(request.getSpecId(), 10);
        ReviewSection reviewSection = ReviewSection.builder()
                .reviews(reviews)
                .reviewCount(reviews.size())
                .build();

        response.setReviewSection(reviewSection);

        return ResponseEntity.ok(response);
    }
    // 차량 목록 페이지  (차종 카드)
    @GetMapping
    public ResponseEntity<List<CarListItemDto>> getCarList(
            @RequestParam Long pickupBranchId,
            @RequestParam(required = false) Long returnBranchId,
            @RequestParam(required = false) String startDateTime,
            @RequestParam(required = false) String endDateTime,
            @RequestParam(defaultValue = "SHORT") RentType rentType  // enum으로 직접 바인딩
    ) {
        return ResponseEntity.ok(carListService.getCarListItems(
                pickupBranchId, startDateTime, endDateTime, rentType ));
    }
    }



