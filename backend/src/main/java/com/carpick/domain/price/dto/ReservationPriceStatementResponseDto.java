package com.carpick.domain.price.dto;


import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;


/**
 * 예약 가격 명세서 응답 DTO
 *
 * 목적:
 * - "이 예약의 가격이 왜 이렇게 계산되었는지"를 설명하기 위한 DTO
 * - UI에 항상 노출할 필요는 없으며,
 *   CS / 관리자 / 문제 발생 시 근거 자료로 사용
 *
 * 기준 테이블:
 * - reservation_price_detail
 */

@Getter
@Builder
public class ReservationPriceStatementResponseDto {
    /* ==================================================
     * 1. 결과 금액 (Result)
     * ==================================================
     * 실제 고객에게 청구된 확정 금액들
     */

    /** 최종 대여료
     *  - 단기: (일 단가 * 일수) + (시간 단가 * 시간)
     *  - 장기: (월 단가 * 개월 수)
     */
    private BigDecimal rentFee;

    /** 최종 보험료
     *  - 단기 렌트에서만 사용
     *  - 보험 산정 기준 일수(insuranceAppliedDays) * 보험 단가
     */
    private BigDecimal insuranceFee;

    /** 적용된 쿠폰 할인 금액
     *  - 쿠폰 미적용 시 0
     */
    private BigDecimal couponDiscount;

    /** 최종 결제 금액
     *  - rentFee + insuranceFee - couponDiscount
     */
    private BigDecimal totalAmount;


    /* ==================================================
     * 2. 계산 타입 (Calculation Model)
     * ==================================================
     * 가격이 어떤 요금제 기준으로 계산되었는지에 대한 스냅샷
     */

    /** 요금제 타입
     *  - SHORT_TERM : 단기 렌트 (일 + 시간 단위 계산)
     *  - LONG_TERM  : 장기 렌트 (월 단위 계산)
     *
     *  주의:
     *  - reservation 테이블의 rentType과 같을 수도 있지만,
     *    "가격 계산이 어떤 모델로 수행되었는지"를 고정하기 위한 값
     */
    private String priceType;


    /* ==================================================
     * 3. 단가 정보 (Applied Unit Price)
     * ==================================================
     * 계산 당시 실제 사용된 단가 스냅샷
     * 정책 변경과 무관하게 과거 계산을 설명하기 위한 근거
     */

    /** 적용된 일 단가
     *  - 단기 렌트에서 사용
     *  - 하루(24시간) 기준의 단가
     */
    private BigDecimal appliedDailyPrice;

    /** 적용된 시간 단가
     *  - 단기 렌트에서 사용
     *  - appliedDailyPrice / 24 로 계산된 값
     *  - 반올림/절삭 규칙이 이미 적용된 '박제 값'
     */
    private BigDecimal appliedHourlyPrice;

    /** 적용된 월 단가
     *  - 장기 렌트에서 사용
     */
    private BigDecimal appliedMonthlyPrice;


    /* ==================================================
     * 4. 기간 정보 (Applied Duration)
     * ==================================================
     * 실제 가격 계산에 사용된 확정 기간
     * start/end 날짜 차이와 다를 수 있음
     */

    /** 적용된 대여 일수
     *  - 단기 렌트 기준
     */
    private Integer appliedDays;

    /** 적용된 대여 잔여 시간
     *  - 단기 렌트 기준
     */
    private Integer appliedHours;

    /** 적용된 대여 개월 수
     *  - 장기 렌트 기준
     */
    private Integer appliedMonths;


    /* ==================================================
     * 5. 보험 계산 근거 (Insurance Evidence)
     * ==================================================
     */

    /** 보험료 산정 기준 일수
     *  - 단기 렌트에서만 사용
     *  - 대여 시간이 하루를 초과하면 무조건 올림 처리된 값
     *
     *  예:
     *  - 실제 대여 25시간 → insuranceAppliedDays = 2
     */
    private Integer insuranceAppliedDays;

}
