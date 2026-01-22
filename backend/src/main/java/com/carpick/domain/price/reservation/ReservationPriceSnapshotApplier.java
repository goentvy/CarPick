package com.carpick.domain.price.reservation;


import com.carpick.domain.price.dto.ReservationPriceSummaryResponseDto;
import com.carpick.domain.reservation.entity.Reservation;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ReservationPriceSnapshotApplier {
//    [역할]
// * - 예약 견적 결과(ReservationPriceSummaryResponseDto)를
// *   Reservation 엔티티의 스냅샷 컬럼에 매핑(세팅)한다.
//    [주의]
// * - 금액 계산은 절대 하지 않는다. (계산은 ReservationPriceSummaryService 책임)
// * - null 값은 BigDecimal.ZERO로 방어한다.
public void apply(Reservation reservation, ReservationPriceSummaryResponseDto price) {
    if (reservation == null) {
        throw new IllegalArgumentException("reservation이 비어있습니다.");
    }
    if (price == null) {
        throw new IllegalArgumentException("price(견적 결과 DTO)가 비어있습니다.");
    }

    BigDecimal rentFee = nvl(price.getRentFee());
    BigDecimal insuranceFee = nvl(price.getInsuranceFee());
    BigDecimal couponDiscount = nvl(price.getCouponDiscount());
    BigDecimal totalAmount = nvl(price.getTotalAmount());

    // 1) 기본 대여료/보험료 스냅샷
    reservation.setBaseRentFeeSnapshot(rentFee);
    reservation.setBaseInsuranceFeeSnapshot(insuranceFee);

    // 2) 쿠폰 할인 스냅샷
    reservation.setCouponDiscountSnapshot(couponDiscount);

    // 3) 최종 결제액 스냅샷
    reservation.setTotalAmountSnapshot(totalAmount);

    // 4) 실제 적용 금액 스냅샷
    // MVP에서는 할인 전/후가 동일하므로 동일하게 세팅한다.
    // (필드가 없다면 아래 두 줄은 삭제하세요.)
    reservation.setAppliedRentFeeSnapshot(rentFee);
    reservation.setAppliedInsuranceFeeSnapshot(insuranceFee);

    // 5) 할인/옵션 관련 스냅샷 (MVP: 전부 0으로 명시)
    reservation.setRentDiscountAmountSnapshot(BigDecimal.ZERO);
    reservation.setInsuranceDiscountAmountSnapshot(BigDecimal.ZERO);
    reservation.setOptionFeeSnapshot(BigDecimal.ZERO);
    reservation.setMemberDiscountRateSnapshot(BigDecimal.ZERO);
    reservation.setEventDiscountAmountSnapshot(BigDecimal.ZERO);

}

    private BigDecimal nvl(BigDecimal v) {
        return (v == null) ? BigDecimal.ZERO : v;
    }
}
