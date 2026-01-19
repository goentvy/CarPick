package com.carpick.domain.price.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ReservationPriceSummaryResponseDto {
    /**
     * 대여료(기본)
     * - Reservation.baseRentFeeSnapshot 에 저장/매칭
     * - MVP에서는 할인 전 대여료 = 적용 대여료로 동일하게 사용 가능
     */
    private BigDecimal rentFee;

    /**
     * 보험료(기본)
     * - Reservation.baseInsuranceFeeSnapshot 에 저장/매칭
     * - MVP에서는 할인 전 보험료 = 적용 보험료로 동일하게 사용 가능
     */
    private BigDecimal insuranceFee;

    /**
     * 쿠폰 할인액
     * - Reservation.couponDiscountSnapshot 에 저장/매칭
     * - 쿠폰 미적용이면 BigDecimal.ZERO
     */
    private BigDecimal couponDiscount;

    /**
     * 최종 결제액
     * - Reservation.totalAmountSnapshot 에 저장/매칭
     * - 계산: rentFee + insuranceFee - couponDiscount
     */
    private BigDecimal totalAmount;

    /* =========================
     * (선택) 디버깅/표시용 확장
     * =========================
     * 아래 2개는 "실제 적용된 금액"을 프런트에서 따로 보여주고 싶을 때만 사용하세요.
     * - Reservation.appliedRentFeeSnapshot
     * - Reservation.appliedInsuranceFeeSnapshot
     *
     * MVP에서는 rentFee/insuranceFee와 동일하므로 DTO에 굳이 포함 안 해도 됩니다.
     */
    // private BigDecimal appliedRentFee;
    // private BigDecimal appliedInsuranceFee;
}
