package com.carpick.domain.reservation.dto.response;


import lombok.Data;

import java.util.List;

@Data
public class ReservationFormResponseDto {
    private CarSummaryDto car;
    private  BranchSummaryDto pickupBranch;
    private  BranchSummaryDto dropoffBranch;
    private  PaymentSummaryDto paymentSummary;
    private List<InsuranceOptionDto> insuranceOptions;
//    private List<CarBadgeDto> badges;
    // ===== 차량 요약 =====
    @Data
    public static class CarSummaryDto{
        private Long carId;
        private String title;
        private String subtitle;
        private String imageUrl;
        // ✅ 어제 mock의 estimatedTotalPrice(128000)를 1일 가격으로 사용
        private int dailyPrice;
        private String currency; // KRW



    }
    // ===== 차량 뱃지 =====
//    @Data
//    public static class CarBadgeDto{
//        private String icon; // "fuel" / "seats" / "carType" 같은 키
//        private String text;  // "Petrol" / "4" / "Hatchback"
//    }
    // ===== 지점 정보 =====
    @Data
    public static class BranchSummaryDto{
        private Long branchId;
        private String branchName;
        private String address;
        private String openHours;

    }
    // ===== 보험 옵션 =====
    @Data
    public static class InsuranceOptionDto{
        private String code;  // NONE / NORMAL / FULL
        private String label;  // 선택안함 / 일반자차 / 완전자차
        private String summaryLabel; // 결제정보 표기용: 선택안함/일반면책/완전자차
        private int extraDailyPrice; // 보험 추가금 (1일)
        private String desc; // 사고 시 고객부담금 전액/30만원/면제
        private boolean isDefault; // 초기 선택값 (예: NONE=true)
    }
    // ===== 결제 정보 =====
    @Data
    public static class PaymentSummaryDto{
        private int carDailyPrice; // 차량 요금 (1일)
        private int insuranceDailyPrice; // 보험 요금 (1일)
        private int totalPrice; // 총 결제 금액 (차량 + 보험)
        private String currency; // KRW
    }

}
