package com.carpick.domain.price.service;

import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.insurance.mapper.InsuranceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;


import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
public class InsuranceCalculatorService {
    private final InsuranceMapper insuranceMapper;



    public BigDecimal calculateInsuranceFee(InsuranceCode insuranceCode,
                                            LocalDateTime start,
                                            LocalDateTime end) {

        InsuranceCode code = (insuranceCode == null) ? InsuranceCode.NONE : insuranceCode;

        long chargeDays = calcChargeDays(start, end);

        InsuranceRawDto opt = insuranceMapper.selectInsuranceByCodeV2(code.name());
        if (opt == null) {
            throw new IllegalArgumentException("보험 옵션을 찾을 수 없습니다. code=" + code.name());
        }

        BigDecimal daily = opt.getExtraDailyPrice(); // BigDecimal
        if (daily == null) {
            throw new IllegalArgumentException("보험 일당 금액이 비어있습니다. code=" + code.name());
        }

        return daily.multiply(BigDecimal.valueOf(chargeDays));
    }
    // 과금일수 정책: (end-start) 이용시간을 24시간 단위로 올림하여 최소 1일

    private long calcChargeDays(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("기간이 비어있습니다.");
        }
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("종료시간은 시작시간 이후여야 합니다.");
        }

        long minutes = java.time.Duration.between(start, end).toMinutes();

        long dayMinutes = 24L * 60; // 1440분
        long days = (minutes + dayMinutes - 1) / dayMinutes; // 올림(ceil)

        return Math.max(1, days);
    }
}
