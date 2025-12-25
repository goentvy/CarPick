package com.carpick.admin.priceAdmin.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;


/**
 * [가격 정책 DTO - 전략적 요금 설정]
 * 성수기/비수기, 지점별 특가 등 조건부 가격 정책을 관리합니다.
 * 예: "7~8월 제주점 아반떼 20% 할증"
 */
@Data
public class AdminPricePolicyDto {

    // 1️⃣ [식별자]
    private Long pricePolicyId;      // 정책 ID (PK)

    // 2️⃣ [적용 대상] - 누구에게 적용할 것인가?
    private Long specId;             // 차량 ID (FK)
    private Long branchId;           // 지점 ID (FK) - Null이면 '전국 공통'

    // 🌟 [화면 표시용] - 관리자가 알아보기 쉽게 이름 표시 (JOIN 데이터)
    private String modelName;        // 차종명 (예: 쏘나타)
    private String branchName;       // 지점명 (예: 제주점, 없으면 '전국/공통' 표시)

    // 3️⃣ [요금 설계]
    private String unitType;         // 요금 단위 (DAILY / MONTHLY)
    private Integer basePrice;       // 기준 원가 (할인 전 금액)
    private Integer discountRate;    // 할인율 (%) - 예: 10 입력 시 10% 할인

    // 4️⃣ [유효 기간] - 성수기 관리의 핵심
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime validFrom; // 정책 시작일 (YYYY-MM-DD HH:mm)

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime validTo;   // 정책 종료일

    // 5️⃣ [상태 관리]
    private Boolean isActive;        // 운영 여부 (지금 당장 써먹을 정책인가?)

    // 6️⃣ [운영용]
    private String useYn;            // 소프트 삭제 여부 (실수로 지워도 복구 가능)

    // 7️⃣ [정보용]
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt; // 최근 수정일


}
