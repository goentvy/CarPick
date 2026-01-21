package com.carpick.domain.price.display;

import com.carpick.domain.price.common.PriceApplyDiscount;
import com.carpick.domain.price.common.PriceReverseCalculator;
import com.carpick.domain.price.shortTerm.rent.ShortRentChargeCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PriceCalculatorService {
//    +차량 상세,  차 목록  총책임자
//    +책임
//   1. 렌트 타입(단기/장기) 라우팅
//    2.공통 정책/표시 규칙의 단일화
//    3.출력 포맷 통일(= 결과 DTO 표준화)
//    +하면 안될것
//    1. 단기 계산 로직(일+시간 요금, 단기 보험료)을 여기서 직접 계산
//    2.장기 계산 로직(월 요금, 장기 보험/프로모션)을 여기서 직접 계산
//    +권장구조
//    1.PriceCalculatorService : 총책임자(라우팅 + 공통표시정책 + 결과표준화)
//    2.ShortTermPriceCalculator : 단기 계산 전담
//    3.LongTermPriceCalculator : 장기 계산 전담



//역산계산
private final PriceReverseCalculator priceReverseCalculator;
    public BigDecimal reverseBasePriceFromDiscountedPrice(BigDecimal discountedPrice, int discountRate) {
        return priceReverseCalculator.reverseBasePriceFromDiscountedPrice(discountedPrice, discountRate);
    }
//차량 진짜 할인
    public BigDecimal applyDiscount(BigDecimal basePrice, int discountRate) {
        return PriceApplyDiscount.apply(basePrice, discountRate);
    }


}
