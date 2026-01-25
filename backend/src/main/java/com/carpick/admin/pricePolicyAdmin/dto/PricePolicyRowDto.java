package com.carpick.admin.pricePolicyAdmin.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PricePolicyRowDto {

    private Long pricePolicyId;     // 가격정책 ID

    /* ===== 적용 대상 ===== */
    private Long branchId;           // 지점 ID
    private Long specId;             // 차종 ID (NULL = 지점 전체 적용)
    private String priceType;        // 가격 단위 (DAILY: 단기, MONTHLY: 장기)

    /* ===== 할인 정보 (표시용) ===== */
    private Integer discountRate;    // 기본 할인율 (%)

    /* ===== 적용 기간 ===== */
    private LocalDateTime validFrom; // 적용 시작 일시
    private LocalDateTime validTo;   // 적용 종료 일시 (NULL = 무기한)

    /* ===== 상태 ===== */
    private Boolean isActive;        // 활성 여부
    private String useYn;            // 사용 여부 (Y/N)
    private LocalDateTime deletedAt; // 논리 삭제 일시

    /* ===== 감사 컬럼 ===== */
    private LocalDateTime createdAt; // 생성 일시
    private LocalDateTime updatedAt; // 수정 일시

    /* ===== 화면 표시용 ===== */
    private String branchName;       // 지점명
    private String specName;         // 차종명 (NULL = 지점 전체)

}
