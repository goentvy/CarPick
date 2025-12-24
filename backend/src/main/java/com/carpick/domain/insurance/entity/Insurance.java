package com.carpick.domain.insurance.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Insurance {
    private Long insuranceId;                // 보험 옵션 ID (PK)

    /* 1. 식별 코드 */
    private String code;                     // 보험 코드 (NONE / STANDARD / FULL 등)

    /* 2. 화면 표시용 */
    private String label;                    // 표시 이름 (선택안함 / 일반자차 / 완전자차)
    private String summaryLabel;             // 요약 문구 (사고 시 고객부담금 면제 등)

    /* 3. 금액 (계산용) */
    private BigDecimal extraDailyPrice;      // 1일 보험 추가요금 (원)

    /* 4. 관리 / 정책 */
    private Boolean isDefault;               // 기본 선택 여부 (true면 자동 선택)
    private Boolean isActive;                // 사용 여부 (운영 중인 보험인지)
    private Integer sortOrder;               // 노출 순서 (보험 카드 정렬용)

    /* 5. 공통 */
    private LocalDateTime createdAt;          // 생성일시
    private LocalDateTime updatedAt;          // 수정일시


}
