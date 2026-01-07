package com.carpick.admin.insuranceAdmin.dto;

import com.carpick.domain.insurance.enums.InsuranceCode;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminInsuranceDto {
    // 1️⃣ [식별자]
    private Long insuranceId;                // 보험 옵션 ID (PK)

    // 2️⃣ [식별 코드] - Enum 사용 (NONE / STANDARD / FULL)
    private InsuranceCode insuranceCode;              // 보험 코드

    // 3️⃣ [화면 표시용]
    private String insuranceLabel;                    // 표시 이름 (선택안함 / 일반자차 / 완전자차)
    private String summaryLabel;             // 요약 문구 (사고 시 고객부담금 면제 등)

    // 4️⃣ [금액 정보]
    private BigDecimal extraDailyPrice;      // 1일 보험 추가요금 (원)

    // 5️⃣ [정책/상태]
    private Boolean isDefault;               // 기본 선택 여부 (true면 자동 선택)
    private Boolean isActive;                // 사용 여부 (운영 중인 보험인지)
    private Integer sortOrder;               // 노출 순서 (숫자 낮을수록 위로)

    // 6️⃣ [운영용] - 소프트 삭제 플래그
    private String useYn;                    // 논리 삭제 여부 (Y/N)


    @JsonFormat(shape = JsonFormat.Shape.STRING,
            pattern = "yyyy-MM-dd HH:mm:ss",
            timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;

}
