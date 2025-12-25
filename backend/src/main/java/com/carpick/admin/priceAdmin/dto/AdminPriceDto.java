package com.carpick.admin.priceAdmin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminPriceDto {
    // 1️⃣ [식별자]
    private Long priceId;            // 가격 ID (PK)

    // 2️⃣ [연결 정보]
    private Long carSpecId;          // 차량 스펙 ID (FK) - 저장용

    // 🌟 [화면 표시용] - 리스트에서 "ID:5" 대신 "그랜저"라고 보여주기 위함 (JOIN)
    private String modelName;        // 차종명

    // 3️⃣ [가격 설정] - 인라인 편집 대상
    private BigDecimal dailyPrice;   // 1일 표준 대여료
    private BigDecimal price1m;      // 1개월 장기 대여료
    private BigDecimal price3m;      // 3개월 장기 대여료
    private BigDecimal price6m;      // 6개월 장기 대여료

    // 4️⃣ [운영용]
    private String useYn;            // 소프트 삭제 여부 (Y/N)

    // 5️⃣ [정보용]
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt; // 최근 수정일

}
