package com.carpick.domain.reservation.dtoV2.response;



import com.azure.core.annotation.ReturnType;
import com.carpick.domain.payment.dto.PaymentSummaryDtoV2;
import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.RentType;
import com.carpick.domain.reservation.enums.ReturnTypes;
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
    private PickupLocationDtoV2 pickupLocation;    // ✅ 추가
    private ReturnLocationDtoV2 returnLocation;    // ✅ 추가

    @Data
    public static class CarSummaryDtoV2{
        private Long specId;
        private String title;
        private String subtitle;
        private String imageUrl;





    }
    @Data
    public static class PickupLocationDtoV2 {
        private PickupType pickType;       // VISIT | DELIVERY
        private Long branchId;         // VISIT일 때
        private String branchName;     // VISIT일 때
        private String address;        // VISIT: 지점주소 / DELIVERY: 배달주소
        private String contact;        // 지점 연락처
        private Double latitude;
        private Double longitude;
    }

    @Data
    public static class ReturnLocationDtoV2 {
        private ReturnTypes returnType;       // VISIT | DROPZONE
        private Long branchId;         // VISIT일 때
        private String branchName;     // VISIT일 때
        private String address;        // VISIT: 지점주소 / DROPZONE: 드롭존주소
        private String contact;        // 지점 연락처
        private Long dropzoneId;       // DROPZONE일 때만
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
