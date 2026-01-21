package com.carpick.domain.price.shortTerm.duration;



//[역할]
// * - 단기 렌트의 "실제 이용 시간"을 표현하는 불변 값 객체
// 프런트는 시간 단위 UI를 사용하지만,
// *   백엔드는 내부 계산 기준을 분(minute) 단위로 통일
// * - 정책 변경(시간 올림/버림, 보험 과금 규칙 등)에 대비햇음
public record ShortRentDuration(long totalMinutes ) {
    private static final long MINUTES_PER_DAY = 24L * 60;

    public long daysPart() {
        return totalMinutes / MINUTES_PER_DAY;
    }

    public long hoursPart() {
        return (totalMinutes % MINUTES_PER_DAY) / 60;
    }


}
