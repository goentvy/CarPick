package com.carpick.domain.reservation.enums;

import com.carpick.domain.price.enums.PriceType;
import lombok.Getter;

@Getter
public enum RentType {

    // 1. 여기에 3번째 짝꿍(PriceType)을 넣어줘야 합니다.
    SHORT("단기 렌트", "일/시간 단위로 대여하는 일반 렌트 방식", PriceType.DAILY),
    LONG("장기 렌트", "월 단위 계약으로 대여하는 장기 렌트 방식", PriceType.MONTHLY);

    private final String description;
    private final String detail;
    private final PriceType mappedPriceType; // final은 무조건 값이 있어야 함!

    // 2. 생성자는 이거 '하나'만 남기세요. (3개 다 받는 생성자)
    // (기존에 있던 2개짜리 생성자는 지우셔야 에러가 사라집니다)
    RentType(String description, String detail, PriceType mappedPriceType) {
        this.description = description;
        this.detail = detail;
        this.mappedPriceType = mappedPriceType;
    }

    // 3. 변환 메서드
    public PriceType toPriceType() {
        return this.mappedPriceType;
    }
}
