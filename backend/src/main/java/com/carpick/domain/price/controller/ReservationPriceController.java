package com.carpick.domain.price.controller;


import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.price.dto.ReservationPriceSummaryRequestDto;
import com.carpick.domain.price.dto.ReservationPriceSummaryResponseDto;
import com.carpick.domain.price.reservation.ReservationPriceSummaryService;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/api/v2/reservations/price")
@RequiredArgsConstructor
public class ReservationPriceController {
    private final ReservationPriceSummaryService reservationPriceSummaryService;

    // 프런트 쿼리스트링 날짜 포맷: "2026-01-20 10:00:00" (T 없음)
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 예약 견적(진짜 결제 금액) 조회
     *
     * [프런트 URL 예시]
     * /day?pickupBranchId=1&returnBranchId=1&rentType=short&startDate=2026-01-20 10:00:00&endDate=2026-01-21 10:00:00
     *
     * [의미]
     * - display(정가/할인율/역산) 목적이 아니다.
     * - 이 결과는 Reservation 스냅샷 컬럼에 그대로 저장 가능한 값이어야 한다.
     */
    @GetMapping
    public ResponseEntity<ReservationPriceSummaryResponseDto> getReservationPriceSummary(
            @RequestParam Long specId,

            // 프런트는 "short" / "long" 으로 옴 -> 서버 Enum(SHORT/LONG)으로 변환
            @RequestParam String rentType,

            // 프런트 파라미터명: startDate / endDate
            @RequestParam String startDate,
            @RequestParam String endDate,

            // LONG일 때 선택: 없으면 start/end로 fallback 계산
            @RequestParam(required = false) Integer months,

            // 보험은 선택: 없으면 NONE
            @RequestParam(required = false) InsuranceCode insuranceCode,

            // 쿠폰은 선택
            @RequestParam(required = false) String couponCode
    ) {
        RentType parsedRentType = parseRentType(rentType);

        LocalDateTime start = LocalDateTime.parse(startDate, FORMATTER);
        LocalDateTime end = LocalDateTime.parse(endDate, FORMATTER);

        log.info("예약 견적 조회. specId={}, rentType={}, start={}, end={}, months={}, insuranceCode={}, couponCode={}",
                specId, parsedRentType, startDate, endDate, months, insuranceCode, couponCode);

        ReservationPriceSummaryRequestDto req = new ReservationPriceSummaryRequestDto();
        req.setSpecId(specId);
        req.setRentType(parsedRentType);
        req.setStartDateTime(start);
        req.setEndDateTime(end);
        req.setMonths(months);
        req.setInsuranceCode(insuranceCode); // service에서 null -> NONE 처리
        req.setCouponCode(couponCode);

        ReservationPriceSummaryResponseDto res = reservationPriceSummaryService.calculate(req);
        return ResponseEntity.ok(res);
    }

    /**
     * 프런트 rentType 문자열("short"/"long")을 서버 Enum(SHORT/LONG)으로 변환
     *
     * [수정 포인트]
     * - 프런트가 이미 소문자로 보내고 있으므로 컨트롤러에서 한 번 흡수해주면
     *   서비스/도메인 계층은 RentType(SHORT/LONG)만 보게 되어 깔끔해집니다.
     */
    private RentType parseRentType(String rentType) {
        if (rentType == null || rentType.isBlank()) {
            return RentType.SHORT; // 기본값
        }
        String v = rentType.trim().toUpperCase();
        // "short" -> "SHORT", "long" -> "LONG"
        return RentType.valueOf(v);
    }
}
