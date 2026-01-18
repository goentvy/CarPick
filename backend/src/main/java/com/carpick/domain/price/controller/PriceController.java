package com.carpick.domain.price.controller;

import com.carpick.common.vo.Period;
import com.carpick.domain.price.dto.PriceDisplayDTO;
import com.carpick.domain.price.service.PriceSummaryService;
import com.carpick.domain.reservation.enums.RentType;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/api/price")
@RequiredArgsConstructor
public class PriceController {
    private final PriceSummaryService priceSummaryService;

    // 프론트 형식: "2026-01-17 10:00:00"
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * [MVP] 단기 렌트 가격 조회
     *
     * 프론트 URL 예시:
     * /api/price?specId=1&branchId=1&startDate=2026-01-17 10:00:00&endDate=2026-01-18 10:00:00&rentType=SHORT
     */
    @GetMapping
    public ResponseEntity<PriceDisplayDTO> getPrice(
            @RequestParam Long specId,
            @RequestParam Long branchId,
            @RequestParam String startDate,  // String으로 받음
            @RequestParam String endDate,    // String으로 받음
            @RequestParam(defaultValue = "SHORT") RentType rentType,
            @RequestParam(required = false) String couponCode,
            @RequestParam(required = false) Integer rentMonths
    ) {
        log.info("가격 조회 요청. specId={}, branchId={}, rentType={}, period={} ~ {}",
                specId, branchId, rentType, startDate, endDate);

        // String → LocalDateTime 변환
        LocalDateTime start = LocalDateTime.parse(startDate, FORMATTER);
        LocalDateTime end = LocalDateTime.parse(endDate, FORMATTER);

        // Period 생성
        Period period = new Period(start, end);

        // 가격 계산
        PriceDisplayDTO result = priceSummaryService.calculateDisplayPrice(
                specId,
                branchId,
                period,
                couponCode,
                rentType,
                rentMonths
        );

        return ResponseEntity.ok(result);
    }
}
