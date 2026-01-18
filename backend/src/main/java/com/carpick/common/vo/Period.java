package com.carpick.common.vo;

import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Getter
@ToString
public class Period {
    private final LocalDateTime startDateTime;
    private final LocalDateTime endDateTime;

    public Period(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        verifyPeriod(startDateTime, endDateTime);
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    private void verifyPeriod(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("시작일과 종료일은 필수입니다.");
        }
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("종료일은 시작일보다 빠를 수 없습니다.");
        }
        if (start.isEqual(end)) {
            throw new IllegalArgumentException("대여 시작일과 종료일이 같을 수 없습니다.");
        }
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("종료일은 시작일보다 늦어야 합니다.");
        }

    }

    public long getRentDays() {
        long totalHours = ChronoUnit.HOURS.between(startDateTime, endDateTime);
        return totalHours / 24;
    }

    public long getRentRemainHours() {
        long totalHours = ChronoUnit.HOURS.between(startDateTime, endDateTime);
        return totalHours % 24;
    }

    public long getTotalHours() {
        return ChronoUnit.HOURS.between(startDateTime, endDateTime);
    }

    public long getRentDaysForBilling() {
        long totalHours = ChronoUnit.HOURS.between(startDateTime, endDateTime);
        // 24시간 단위 올림(ceil) + 최소 1일 보장
        long days = (totalHours + 23) / 24;
        return Math.max(days, 1);
    }
    // Period.java에 추가
    public int getRentMonths() {
        long days = getRentDays();
        int months = (int) Math.ceil(days / 30.0);
        return Math.max(1, Math.min(months, 12));  // 1~12 범위
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Period period = (Period) o;
        return Objects.equals(startDateTime, period.startDateTime) &&
                Objects.equals(endDateTime, period.endDateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(startDateTime, endDateTime);
    }
}
