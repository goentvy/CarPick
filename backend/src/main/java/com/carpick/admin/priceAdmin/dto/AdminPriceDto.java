package com.carpick.admin.priceAdmin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 *  [관리자] 가격 및 할인 정책 통합 DTO
 * * [설명]
 * - 차종 정보(CAR_SPEC), 기본 요금(PRICE), 할인 정책(PRICE_POLICY)을 하나로 합친 객체입니다.
 * - 단기/장기 요금의 '원가'와 할인율이 적용된 '최종 금액'을 한 행(Row)에서 관리합니다.
 * - 'useYn' 필드를 통해 데이터의 논리 삭제 및 노출 여부를 제어합니다.
 */


@Data
public class AdminPriceDto {
    // =====  식별자 (PK/FK) =====
    private Long priceId;           // [PRICE 테이블] PK - 장기 요금 수정 시 사용

    private Long specId;         // [CAR_SPEC 테이블] FK - 차종 식별 ID

    // =====  조인용 필드 (차종 정보) =====
    private String brand;           // 브랜드 (현대, 기아 등)
    private String modelName;       // 모델명 (아반떼, 쏘나타 등)

    // =====  낙관적 락 (Optimistic Lock)  =====
    private Integer version;

    private BigDecimal dailyPrice;          // 1일 대여료 원가


    private BigDecimal monthlyPrice;             // 1개월 대여료 원가


    // =====  운영 및 상태 관리 =====
    private String useYn;           // 사용 여부 ('Y': 활성, 'N': 비활성/논리삭제)
    private LocalDateTime deletedAt; // 삭제 처리된 일시 (논리 삭제 시 기록)

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt; // 마지막 데이터 수정 일시

}
