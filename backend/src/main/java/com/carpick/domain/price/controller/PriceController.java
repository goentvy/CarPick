package com.carpick.domain.price.controller;

import com.carpick.common.vo.Period;
import com.carpick.domain.price.dto.PriceDisplayDTO;
import com.carpick.domain.price.display.PriceSummaryService;
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
@RequestMapping("/api/price")
@RequiredArgsConstructor
public class PriceController {
    private final PriceSummaryService priceSummaryService;
// 장기/단기 가격 엔드 포인트


    // 프론트 형식: "2026-01-17 10:00:00"
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 단기/장기 렌트 가격(표시용) 조회
     *
     * 예시:
     * /api/price?specId=1&branchId=1&startDate=2026-01-17 10:00:00&endDate=2026-01-18 10:00:00&rentType=SHORT
     * /api/price?specId=1&branchId=1&startDate=2026-01-17 10:00:00&endDate=2026-02-17 10:00:00&rentType=LONG&rentMonths=1
     */
    @GetMapping
    public ResponseEntity<PriceDisplayDTO> getPrice(
            @RequestParam Long specId,
            @RequestParam Long branchId,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "SHORT") RentType rentType,
            @RequestParam(required = false) Integer rentMonths
    ) {
        log.info("가격 조회 요청. specId={}, branchId={}, rentType={}, startDate={}, endDate={}, rentMonths={}",
                specId, branchId, rentType, startDate, endDate, rentMonths);

        LocalDateTime start = LocalDateTime.parse(startDate, FORMATTER);
        LocalDateTime end = LocalDateTime.parse(endDate, FORMATTER);

        Period period = new Period(start, end);

        PriceDisplayDTO result = priceSummaryService.calculateDisplayPrice(
                specId,
                branchId,
                period,
                rentType,
                rentMonths
        );

        return ResponseEntity.ok(result);
    }
}
