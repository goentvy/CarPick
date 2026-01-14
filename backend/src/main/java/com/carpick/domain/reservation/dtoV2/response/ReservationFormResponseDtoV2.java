package com.carpick.domain.reservation.dtoV2.response;


import com.carpick.domain.payment.dto.PaymentSummaryDtoV2;
import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.reservation.enums.RentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
public class ReservationFormResponseDtoV2 {
//     ReservationFormRequestDtoV2에서 날라온 데이터로 화면을 구성하는 dto
    private CarSummaryDtoV2 car;
    private List<InsuranceOptionDtoV2> insuranceOptions;
    private PaymentSummaryDtoV2 paymentSummary;
    @Data
    public static class CarSummaryDtoV2{
        private Long specId;
        private String title;
        private String subtitle;
        private String imageUrl;
        // ✅ 어제 mock의 estimatedTotalPrice(128000)를 1일 가격으로 사용
        private int dailyPrice;
        private String currency; // KRW



    }
    // ===== 보험 옵션 =====
    @Data
    public static class InsuranceOptionDtoV2{
        private String code;  // NONE / NORMAL / FULL
        private String label;  // 선택안함 / 일반자차 / 완전자차
        private String summaryLabel; // 결제정보 표기용: 선택안함/일반면책/완전자차
        private int extraDailyPrice; // 보험 추가금 (1일)
        private String desc; // 사고 시 고객부담금 전액/30만원/면제
        private boolean isDefault; // 초기 선택값 (예: NONE=true)
    }

}
