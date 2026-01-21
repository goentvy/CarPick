package com.carpick.domain.price.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 예약 가격 명세서 엔티티
 * - 매핑 테이블: reservation_price_detail
 * - 용도: 예약 확정 시점의 가격 계산 결과와 근거(스냅샷)를 DB에 저장
 */
@Getter
@Setter
public class ReservationPriceDetail {

    /** * [PK] 예약 가격 명세서 ID
     * - DB 컬럼: reservation_price_detail_id
     */
    private Long reservationPriceDetailId;

    /** [FK] 예약 ID */
    private Long reservationId;

    // --- [1. 결과 금액 (이름 변경됨)] ---

    /** 예약 최종 대여료 (reservation_rent_fee) */
    private BigDecimal reservationRentFee;

    /** 예약 최종 보험료 (reservation_insurance_fee) */
    private BigDecimal reservationInsuranceFee;

    /** 예약 적용 쿠폰 할인 (reservation_coupon_discount) */
    private BigDecimal reservationCouponDiscount;

    /** 예약 최종 결제 금액 (reservation_total_amount) */
    private BigDecimal reservationTotalAmount;


    // --- [2. 계산 근거 (스냅샷)] ---

    /** 요금제 타입 (SHORT_TERM / LONG_TERM) */
    private String priceType;

    /** 적용된 '일' 단가 (단기) */
    private BigDecimal appliedDailyPrice;

    /** 적용된 '시간' 단가 (단기) */
    private BigDecimal appliedHourlyPrice;

    /** 적용된 '월' 단가 (장기) */
    private BigDecimal appliedMonthlyPrice;


    // --- [3. 기간 정보 (스냅샷)] ---

    /** 적용된 대여 일수 */
    private Integer appliedDays;

    /** 적용된 대여 잔여 시간 */
    private Integer appliedHours;

    /** 적용된 대여 개월 수 */
    private Integer appliedMonths;


    // --- [4. 기타] ---

    /** 보험료 산정 기준 일수 */
    private Integer insuranceAppliedDays;

    /** 생성 일시 */
    private LocalDateTime createdAt;
}