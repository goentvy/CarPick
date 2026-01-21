package com.carpick.domain.price.dto;

import com.carpick.domain.coupon.enums.CouponType;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.reservation.enums.RentType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationPriceSummaryRequestDto {
    /** 차종(스펙) ID */
    private Long specId;

    /** 단기/장기 구분 */
    private RentType rentType; // SHORT / LONG

    /**
     * 단기용 시작일시
     * - 프런트에서 "yyyy-MM-dd HH:mm:ss" (T 없음)으로 보내는 전제
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDateTime;

    /**
     * 단기용 종료일시
     * - 프런트에서 "yyyy-MM-dd HH:mm:ss" (T 없음)으로 보내는 전제
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDateTime;

    /**
     * 장기용 개월수
     * - rentType=LONG 일 때 사용
     */
    private Integer months;

    /**
     * 보험 코드 (null이면 NONE 처리 권장)
     */
    private InsuranceCode insuranceCode;

    private String couponCode;
}
