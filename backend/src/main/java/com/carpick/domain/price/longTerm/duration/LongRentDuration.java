package com.carpick.domain.price.longTerm.duration;

public record LongRentDuration( int months) {

//    장기 렌트 기간 (개월수 )를 표현하는 불변의 값 객체
//    [역할]
// * - 장기 렌트의 계약 단위인 "개월수"를 명확한 타입으로 고정한다.
// * - 가격 계산기는 months만 신뢰하고, 날짜(start/end)는 계약 정보로만 취급한다.
// *
// * [제약]
// * - months는 1 이상이어야 한다.
public LongRentDuration {
    if (months <= 0) {
        throw new IllegalArgumentException("장기 렌트 개월수(months)는 1 이상이어야 합니다. months=" + months);
    }
}

}
