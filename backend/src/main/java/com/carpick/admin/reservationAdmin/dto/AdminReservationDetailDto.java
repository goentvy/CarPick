package com.carpick.admin.reservationAdmin.dto;

import com.carpick.domain.car.enums.FuelType;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

    @Data
    public class AdminReservationDetailDto {

        /* =========================================================
         * 1️⃣ 예약 식별 정보
         * - 관리자 화면에서 상세 조회 / 이력 추적에 사용
         * ========================================================= */

        private Long reservationId;   // 내부 예약 PK (관리자/시스템용)
        private String reservationNo; // 고객 노출용 예약번호 (CS 응대 시 사용)


        /* =========================================================
         * 2️⃣ 예약자 정보 (USER)
         * - 실제 예약을 생성한 사용자 정보
         * - 관리자 화면에서는 "누가 예약했는지" 확인 용도
         * ========================================================= */

        private Long userId;           // USERS.user_id (다른 사용자 화면 이동용 FK)
        private String name;       // 예약자 이름
        private String email;      // 예약자 이메일 (CS 연락용)


        /* =========================================================
         * 3️⃣ 운전자 정보 (RESERVATION 소속)
         * - 실제 차량을 운전하는 사람 정보
         * - 예약자와 다를 수 있음
         * - Read Only (관리자 수정 불가)
         * ========================================================= */

        private String driverLastName;     // 운전자 성
        private String driverFirstName;    // 운전자 이름
        private LocalDate driverBirthdate; // 운전자 생년월일 (면허/보험 검증용)

        private String driverPhone;        // 운전자 연락처
        private String driverEmail;        // 운전자 이메일
        private String driverLicenseNo;    // 운전면허 번호


        /* =========================================================
         * 4️⃣ 차량 정보 (VEHICLE_INVENTORY + CAR_SPEC)
         * - 어떤 "실차"가 배정되었는지 확인
         * ========================================================= */

        private Long vehicleId;            // VEHICLE_INVENTORY.vehicle_id (실차 식별 FK)

        private String brand;              // 제조사 (예: 기아, 현대)
        private String displayNameShort;   // 카드/목록용 짧은 모델명 (CAR_SPEC.display_name_short)
        private String modelName;          // 정식 모델명 (CAR_SPEC.model_name)

        private String carNo;              // 차량 번호판 (실제 차량 구분용)
        private FuelType fuelType;         // 연료 타입 (GASOLINE / DIESEL / EV 등)


        /* =========================================================
         * 5️⃣ 예약 일정 정보
         * - 대여 기간 및 실제 반납 시간
         * ========================================================= */

        private LocalDateTime startDate;        // 대여 시작 일시
        private LocalDateTime endDate;          // 대여 종료 예정 일시
        private LocalDateTime actualReturnDate; // 실제 반납 일시 (미반납 시 null)


        /* =========================================================
         * 6️⃣ 인수 / 반납 방식 및 장소
         * - 방문 수령 / 배달 여부 및 주소 정보
         * ========================================================= */

        private Long pickupBranchId;       // 인수 지점 ID (BRANCH FK)
        private PickupType pickupType;     // 인수 방식 (VISIT / DELIVERY)
        private String pickupBranchName;   // 인수 지점명
        private String pickupAddress;      // 배달 주소 (DELIVERY일 경우만 사용)

        private Long returnBranchId;        // 반납 지점 ID (BRANCH FK)
        private ReturnTypes returnType;     // 반납 방식
        private String returnBranchName;    // 반납 지점명
        private String returnAddress;       // 반납 주소 (배달 반납일 경우)


        /* =========================================================
         * 7️⃣ 보험 / 쿠폰 정보
         * - 적용된 보험 옵션과 할인 쿠폰 정보
         * ========================================================= */

        private Long insuranceId;           // INSURANCE.insurance_id (FK)
        private String insuranceLabel;      // 보험 표시 이름 (선택안함 / 일반자차 / 완전자차)

        private Long couponId;              // 쿠폰 ID (nullable)
        private String couponName;          // 쿠폰 이름


        /* =========================================================
         * 8️⃣ 금액 정보 (결제 스냅샷)
         * - 예약 시점 기준 금액
         * - 절대 재계산하거나 수정하지 않음
         * ========================================================= */

        private BigDecimal baseRentFeeSnapshot;              // 기본 대여료
        private BigDecimal rentDiscountAmountSnapshot;       // 대여료 할인 금액

        private BigDecimal baseInsuranceFeeSnapshot;         // 기본 보험료
        private BigDecimal insuranceDiscountAmountSnapshot;  // 보험 할인 금액

        private BigDecimal optionFeeSnapshot;                // 옵션 요금

        private BigDecimal couponDiscountSnapshot;    // ✅ 스키마: coupon_discount_snapshot
        private BigDecimal eventDiscountAmountSnapshot;      // 이벤트 할인 금액

        private BigDecimal totalAmountSnapshot;              // 최종 결제 금액 (가장 중요)


        /* =========================================================
         * 9️⃣ 예약 상태 / 취소 정보
         * - 관리자 화면에서 상태 확인 및 변경 대상
         * ========================================================= */

        private ReservationStatus reservationStatus; // 예약 상태 (CONFIRMED / CANCELED / COMPLETED 등)
        private String cancelReason;                  // 취소 사유 (취소 시에만 존재)

        private LocalDateTime cancelledAt;            // 취소 일시


        /* =========================================================
         * 🔟 메타 데이터
         * - 시스템 기록용 (감사/이력 추적)
         * ========================================================= */

        private LocalDateTime createdAt;   // 예약 생성 시각
        private LocalDateTime updatedAt;   // 예약 정보 마지막 변경 시각
}
