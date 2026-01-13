package com.carpick.domain.car.controller;


import com.carpick.domain.car.dto.carListPage.CarListItemDto;
import com.carpick.domain.car.dto.Legacycardetailpage.LegacyCarDetailResponseDto;
import com.carpick.domain.car.service.CarListService;
import com.carpick.domain.car.service.CarService;
import com.carpick.domain.reservation.enums.RentType;
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

    //차량상세 (DB 연동)
    @GetMapping("/{carId}")
    public ResponseEntity<LegacyCarDetailResponseDto> getCarDetail(@PathVariable("carId") Long carId) {
    LegacyCarDetailResponseDto carDetail = carService.getCarDetail(carId);  // ✅ 변수명 수정

    //  리뷰 조회
    List<ReviewResponse> reviews = reviewService.getReviewsBySpecId(carId, 10);
    carDetail.setReviews(reviews);

    return ResponseEntity.ok(carDetail);
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



