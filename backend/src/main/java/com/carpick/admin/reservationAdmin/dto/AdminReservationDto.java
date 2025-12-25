package com.carpick.admin.reservationAdmin.dto;

import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AdminReservationDto {
    // 1️⃣ [식별자]
    private Long reservationId;
    private String reservationNo;    // 예약 번호 (고객 조회용)

    // 2️⃣ [연결 정보 - 화면 표시용] (JOIN으로 가져올 데이터)
    // ID만 있으면 관리자가 못 알아보니 이름들을 다 가져옵니다.
    private String userName;         // 예약자 이름 (User 테이블 Join)
    private String userEmail;        // 예약자 이메일

    private String carModelName;     // 차량 모델명 (CarSpec Join)
    private String carNo;            // 차량 번호 (Inventory Join)

    private String pickupBranchName; // 인수 지점명 (Branch Join)
    private String returnBranchName; // 반납 지점명 (Branch Join)

    private String insuranceLabel;   // 적용된 보험명 (Insurance Join)

    // 3️⃣ [운전자 정보] - Read Only (원칙적으로 수정 불가)
    private String driverLastName;
    private String driverFirstName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate driverBirthdate;

    private String driverPhone;
    private String driverEmail;
    private String driverLicenseNo;

    // 4️⃣ [일정 정보]
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime endDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime actualReturnDate; // 실제 반납 시간

    // 5️⃣ [장소 및 방법]
    private PickupType pickupType;      // 배달/지점방문
    private String pickupAddress;       // 배달 주소

    private ReturnTypes returnType;
    private String returnAddress;

    // 6️⃣ [금액 정보 (Snapshot)] - 절대 수정 불가 (당시 결제 내역)
    private BigDecimal totalAmountSnapshot;           // 최종 결제액 (제일 중요)

    // 상세 내역 (필요시 화면 토글로 보여줌)
    private BigDecimal baseRentFeeSnapshot;           // 기본 대여료
    private BigDecimal baseInsuranceFeeSnapshot;      // 기본 보험료
    private BigDecimal optionFeeSnapshot;             // 옵션 요금
    private BigDecimal discountTotal;                 // 할인 총액 (계산해서 넣거나 별도 필드)

    // 7️⃣ [상태 관리] - ⭐ 관리자가 건드릴 수 있는 부분
    private ReservationStatus reservationStatus;      // 상태 (예약중/취소/반납완료)
    private String cancelReason;                      // 취소 사유

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime cancelledAt;


    // 8️⃣ [메타 데이터]
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;
}
