package com.carpick.domain.price.longTerm.duration;

import java.time.LocalDateTime;
import java.time.Period;

//months 계산 책임 고정
public final class LongRentDurationFactory {

//    장기 렌트 기간(개월수) 생성 Factory
//    [역할]
// * - 장기 렌트의 "개월수 결정 책임"을 한 곳에 고정한다.
// * - Service/Calculator는 months만 받아서 계산하고, months 산출 규칙은 여기서만 관리한다.
// *
// * [months 결정 규칙]
// * 1) 요청에 months가 있으면 최우선으로 사용한다. (UI 버튼: 1개월/2개월/3개월...)
// * 2) months가 없고 start/end만 있는 경우에만 날짜로 months를 계산한다.
// *
// * [날짜 기반 months 계산 정책]
// * - Period.between(start.toLocalDate(), end.toLocalDate()).getMonths() 를 사용한다.
// * - 전제: 프런트가 "start + N개월" 형태로 end를 생성한다 (예: 1/20 → 2/20).
// *
// * [주의]
// * - 장기 렌트는 '시간/일수'가 아니라 '계약 개월수'가 본질이다.
// * - 애매한 기간(예: end가 start보다 이전/같음, months=0으로 계산되는 케이스)은 예외로 막는다.
// */

    private LongRentDurationFactory() {
        // static factory 전용
    }

    /**
     * months가 명시된 경우 (권장)
     *
     * @param months 장기 렌트 개월수 (1 이상)
     */
    public static LongRentDuration fromMonths(Integer months) {
        if (months == null) {
            throw new IllegalArgumentException("months가 비어있습니다.");
        }
        return new LongRentDuration(months);
    }

    /**
     * start/end 날짜로 months를 계산하는 fallback
     * - 요청에 months가 없는데 URL로 start/end만 흘러오는 경우 사용
     *
     * @param rentalStart 대여 시작 시점
     * @param rentalEnd   대여 종료 시점
     * @return LongRentDuration(개월수)
     */
    public static LongRentDuration fromDates(LocalDateTime rentalStart, LocalDateTime rentalEnd) {
        if (rentalStart == null || rentalEnd == null) {
            throw new IllegalArgumentException("대여 시작/종료 시간이 비어있습니다.");
        }
        if (!rentalEnd.isAfter(rentalStart)) {
            throw new IllegalArgumentException("종료 시간은 시작 시간 이후여야 합니다.");
        }

        Period p = Period.between(rentalStart.toLocalDate(), rentalEnd.toLocalDate());

        // 전제: end가 start + N개월로 생성되므로 months만 보면 된다.
        int months = p.getYears() * 12 + p.getMonths();

        if (months <= 0) {
            throw new IllegalArgumentException(
                    "유효한 장기 개월수를 계산할 수 없습니다. start=" + rentalStart + ", end=" + rentalEnd
            );
        }

        return new LongRentDuration(months);
    }

    /**
     * months가 있으면 months 우선, 없으면 날짜로 계산
     *
     * @param months      장기 렌트 개월수(선택)
     * @param rentalStart 대여 시작 시점(선택)
     * @param rentalEnd   대여 종료 시점(선택)
     */
    public static LongRentDuration from(Integer months, LocalDateTime rentalStart, LocalDateTime rentalEnd) {
        if (months != null) {
            return fromMonths(months);
        }
        return fromDates(rentalStart, rentalEnd);
    }
}
