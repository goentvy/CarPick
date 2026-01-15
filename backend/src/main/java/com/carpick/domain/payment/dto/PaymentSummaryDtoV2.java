package com.carpick.domain.payment.dto;

import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.reservation.enums.RentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSummaryDtoV2 {
    /* ===== 렌트 유형 (Enum 권장) ===== */
    private RentType rentType;      // SHORT(단기) / LONG(장기)
    private PriceType priceType;    // DAY / MONTH

    /* ===== 기본 가격 정보 ===== */
    private int unitCount;          // 청구 단위 수 (예: 2일이면 2)
    private int baseUnitPrice;      // 기준 단가 (1일 원가)
    private int basePrice;         // 기준 금액 (단가 × 단위)

    /* ===== 할인 요약 (실제 적용은 1개) ===== */
    private int discountTotalPrice;     // 실제 깎아준 돈 (예: 130,000)
    private String discountDesc;    // 설명 (예: "기본 50% + 쿠폰 15% 적용") 전용 헬퍼/유틸로 분리

    /* ===== 보험 ===== */
    private int insuranceTotalPrice;    // 보험 총액

    /* ===== 최종 결제 ===== */
    private int finalTotalPrice;
    // 고객이 낼 돈
    @Builder.Default
    private String currency = "KRW";

}
