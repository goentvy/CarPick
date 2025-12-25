package com.carpick.domain.price.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * [가격 정책 엔티티]
 * 단순한 가격(Price)이 아니라, 기간/지점/조건에 따라 변하는 '정책'을 관리합니다.
 * 예: "여름 성수기 강남점 소나타 가격" vs "겨울 비수기 전국 소나타 가격"
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PricePolicy {
    // 1. 식별자
    private Long pricePolicyId;       // 정책 고유 ID (PK)

    // 2. 적용 대상 (Who & Where)
    private Long specId;              // 대상 차량 ID (FK) - 어떤 차의 가격인가?

    /**
     * 지점 ID (FK)
     * - NULL 이면: "전국 공통 가격" (기본값)
     * - 값이 있으면: "해당 지점 전용 특가" (지점별 요금 차등 적용 시 사용)
     */
    private Long branchId;

    // 3. 요금 설정 (How Much)
    private String unitType;          // 요금 단위 (DAILY: 1일권 / MONTHLY: 월렌트)
    private Integer basePrice;        // 기준 원가 (할인 적용 전의 정가)

    /**
     * 할인율 (0 ~ 100%)
     * - MVP 단계에서는 복잡한 쿠폰 로직 대신, 이 필드로 간단하게 할인 적용
     * - 예: basePrice가 10만원이고 discountRate가 10이면 -> 최종 9만원
     */
    private Integer discountRate;

    // 4. 유효 기간 (When) - 성수기/비수기 관리용
    private LocalDateTime validFrom;  // 정책 시작일 (이 날짜부터 가격 적용)
    private LocalDateTime validTo;    // 정책 종료일 (이 날짜 지나면 가격 효력 상실)

    // 5. 상태 관리
    private Boolean isActive;         // 운영 여부 (true: 현재 판매중, false: 잠시 판매 중단)

    // 6. 시스템 관리 (Soft Delete)
    private String useYn;             // 삭제 여부 (Y: 사용, N: 삭제됨 - 실수로 지워도 복구 가능)

    // 7. 로그
    private LocalDateTime createdAt;  // 생성일시
    private LocalDateTime updatedAt;  // 수정일시

}
