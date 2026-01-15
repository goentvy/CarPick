package com.carpick.domain.payment.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PayStatus {
    APPROVED(
            "결제 승인",
            "결제가 정상적으로 완료되었습니다."
    ),

    DECLINED(
            "결제 거절",
            "결제가 승인되지 않았습니다. 카드 정보를 확인해주세요."
    ),

    ERROR(
            "결제 오류",
            "결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );

    private final String description; // 상태 요약 (내부/로그용)
    private final String detail;       // 사용자 노출 메시지

}
