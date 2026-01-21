package com.carpick.domain.price.dto;

import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.reservation.enums.RentType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class PriceDisplayDTO {
    private PriceType priceType;            // DAILY / MONTHLY
    private BigDecimal displayUnitPrice;    // 굵은 단가(실제 과금 기준: PRICE)
    private BigDecimal basePrice;           // 취소선 정가(표시용: PRICE_POLICY)
    private Integer discountRate;           // 표시용 할인율(PRICE_POLICY)
    @Builder.Default
    private String currency = "KRW";        // 기본값 설정 (Lombok 기능)                // "KRW"
    // [추가된 필드들]

    private RentType rentType;         // SHORT (화면 표시용
    // 기간이 있는 화면(day/예약진입 등)에서만 채움
    private BigDecimal estimatedTotalAmount; // displayUnitPrice * rentDays
    private Long rentDays;
//    기간이 있는경우
public static PriceDisplayDTO ofWithPeriod(
        BigDecimal displayUnitPrice,
        BigDecimal basePrice,
        Integer discountRate,
        PriceType priceType,
        RentType rentType,
        long rentDays,
        BigDecimal estimatedTotalAmount
) {


    return PriceDisplayDTO.builder()
            .priceType(priceType)
            .displayUnitPrice(displayUnitPrice)
            .rentType(rentType)
            .basePrice(basePrice)
            .discountRate(discountRate)
            .currency("KRW")
            .estimatedTotalAmount(estimatedTotalAmount)
            .rentDays(rentDays)
            .build();
}
//기간이 없는경우 (안전장치 )
public static PriceDisplayDTO ofUnitPrice(
        BigDecimal displayUnitPrice,
        BigDecimal basePrice,
        Integer discountRate,
        PriceType priceType,
        RentType rentType
) {
    return PriceDisplayDTO.builder()
            .priceType(priceType)
            .rentType(rentType)
            .displayUnitPrice(displayUnitPrice)
            .basePrice(basePrice)
            .discountRate(discountRate)
            .currency("KRW")
            .estimatedTotalAmount(null)
            .rentDays(null)
            .build();
}

}
