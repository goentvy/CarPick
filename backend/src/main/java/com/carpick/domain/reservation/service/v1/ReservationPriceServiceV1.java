package com.carpick.domain.reservation.service.v1;

import com.carpick.domain.car.dto.Legacycardetailpage.LegacyCarDetailResponseDto;
import com.carpick.domain.car.service.CarService;
import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class ReservationPriceServiceV1 {
    private final CarService carService;
    private final ReservationMapper reservationMapper;

    // ✅ 프론트 합의 포맷: "2025-12-30 15:30:00"
    private static final DateTimeFormatter DATETIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * UI/Command 공용: 가격 견적(estimate)
     * - DB 저장 없음
     * - car/insurance는 서버에서 조회(프론트 신뢰 X)
     */
    public ReservationPriceResponseDto estimate(Long carId, String insuranceCode,
                                                String startDateTime, String endDateTime) {

        LocalDateTime start = parseDateTimeOrNull(startDateTime);
        LocalDateTime end = parseDateTimeOrNull(endDateTime);

        LegacyCarDetailResponseDto detail = carService.getCarDetail(carId);
        int carDailyPrice = detail.getPriceSummary().getDailyPrice().intValue();

        String code = (insuranceCode == null || insuranceCode.isBlank()) ? "NONE" : insuranceCode;
        InsuranceRawDto insurance = reservationMapper.selectInsuranceByCode(code);
        int insuranceDailyPrice = (insurance != null) ? insurance.getExtraDailyPrice().intValue() : 0;

        long days = calcChargeDays(start, end);
        int total = (int) (days * (carDailyPrice + insuranceDailyPrice));

        return new ReservationPriceResponseDto(carDailyPrice, insuranceDailyPrice, total);
    }

    /**
     * 과금 일수 계산 정책:
     * - start/end 없으면 1일
     * - end < start면 예외
     * - 1시간 미만도 1일
     * - 24시간 단위 올림
     */
    private long calcChargeDays(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) return 1;

        if (end.isBefore(start)) {
            throw new IllegalArgumentException("종료일이 시작일보다 빠를 수 없습니다.");
        }

        long hours = ChronoUnit.HOURS.between(start, end);
        if (hours <= 0) return 1;

        long days = (hours + 23) / 24;
        return Math.max(days, 1);
    }

    private LocalDateTime parseDateTimeOrNull(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return LocalDateTime.parse(value, DATETIME_FORMATTER);
        } catch (Exception e) {
            throw new IllegalArgumentException("날짜 포맷이 올바르지 않습니다. (yyyy-MM-dd HH:mm:ss)", e);
        }
    }
}

