package com.carpick.domain.price.shortTerm.duration;


import com.carpick.common.vo.Period;

import java.time.Duration;
import java.time.LocalDateTime;

// [역할]
// * - 시작/종료 시점을 받아 단기 렌트 기간을 계산
// * - 시간 차이 계산 책임을 한 곳에 고정
// * - 기간 계산 정책을 서비스/계산기에서 분리
// 과금 기준(올림/버림/최소 일수 등)은 절대 포함하지 않음
public final class ShortRentDurationFactory {
    private ShortRentDurationFactory() {
        // static factory 전용
    }

    /**
     * 시작/종료 시점으로부터 단기 렌트 기간 생성
     *
     * @param rentalStart 대여 시작 시점
     * @param rentalEnd   대여 종료 시점
     * @return ShortRentDuration (총 이용 분 단위)
     */
    public static ShortRentDuration from(LocalDateTime rentalStart, LocalDateTime rentalEnd) {
        if (rentalStart == null || rentalEnd == null) {
            throw new IllegalArgumentException("대여 시작/종료 시간이 비어있습니다.");
        }
        if (!rentalEnd.isAfter(rentalStart)) {
            throw new IllegalArgumentException("종료 시간은 시작 시간 이후여야 합니다.");
        }

        // 실제 이용 시간(분 단위)
        long totalMinutes = Duration.between(rentalStart, rentalEnd).toMinutes();

        return new ShortRentDuration(totalMinutes);
    }



}
