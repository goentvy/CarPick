package com.carpick.domain.price.shortTerm.insurance;

import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.insurance.mapper.InsuranceMapper;
import com.carpick.domain.price.shortTerm.duration.ShortRentDuration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;


// 단기 보험 요금 계산기
//[정책]
// * - 보험 과금일수 = 24시간(1440분) 단위 올림(ceil)
// * - 최소 1일
// *
// * 예)
// * - 23시간(1380분)  -> 1일
// * - 24시간 1분      -> 2일
// * - 1일 1시간(1500분)-> 2일
// *
// * 주의)
// * - 기간 계산(분 단위 totalMinutes)은 ShortRentDurationFactory 책임
// * - 여기서는 "보험 과금일수" 정책만 적용
// */

@Service
@RequiredArgsConstructor
public class ShortInsuranceCalculatorService {
    private static final long MINUTES_PER_DAY = 24L * 60;

    private final InsuranceMapper insuranceMapper;

    public BigDecimal calculate(InsuranceCode insuranceCode, ShortRentDuration duration) {
        if (duration == null) {
            throw new IllegalArgumentException("기간(duration)이 비어있습니다.");
        }

        InsuranceCode code = (insuranceCode == null) ? InsuranceCode.NONE : insuranceCode;

        long chargeDays = calcChargeDays(duration.totalMinutes());

        InsuranceRawDto opt = insuranceMapper.selectInsuranceByCodeV2(code.name());
        if (opt == null) {
            throw new IllegalArgumentException("보험 옵션을 찾을 수 없습니다. code=" + code.name());
        }

        BigDecimal daily = opt.getExtraDailyPrice();
        if (daily == null) {
            throw new IllegalArgumentException("보험 일당 금액이 비어있습니다. code=" + code.name());
        }

        return daily.multiply(BigDecimal.valueOf(chargeDays));
    }

    // 과금일수 정책: 24시간 단위 올림(ceil), 최소 1일
    private long calcChargeDays(long totalMinutes) {
        if (totalMinutes <= 0) {
            throw new IllegalArgumentException("대여 기간이 0 이하입니다. totalMinutes=" + totalMinutes);
        }

        long days = (totalMinutes + MINUTES_PER_DAY - 1) / MINUTES_PER_DAY; // ceil
        return Math.max(1, days);
    }
}
