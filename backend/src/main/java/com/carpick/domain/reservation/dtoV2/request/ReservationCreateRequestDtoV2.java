package com.carpick.domain.reservation.dtoV2.request;

import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.RentType;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationCreateRequestDtoV2 {
//    고객이 예약하기 버튼을 눌럿을때 서버에게 이조건으로 예약을 하나 만들어 달라고 요청하는 dto
/* ==========================
 * 1. 차량 및 시간 (What & When)
 * ========================== */

    private Long specId;    // ⭕ 차종 ID (예: 아반떼)

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDateTime;

    @NotNull(message = "rentType은 필수입니다. (SHORT/LONG)")
    private RentType rentType;

    /* ==========================
     * 2. 장소 및 방식 (Where & How)
     * ========================== */


    // 픽업 정보
    private Long pickupBranchId;
    private PickupType pickupType; // VISIT / DELIVERY (Enum 사용)

    // 반납 정보 (드롭존 포함)
    private Long returnBranchId;
    private ReturnTypes returnType; // VISIT / DROPZONE (Enum 사용)
    // 드롭존 (선택)
    private Long dropzoneId;       // returnType == DROPZONE 일 때만 사용
    /* ==========================
     * 3. 옵션 (Option)
     * ========================== */
    private String insuranceCode; // NONE / NORMAL / FULL

    /* ==========================
     * 4. 운전자 정보 (Who - 필수!)
     * ========================== */
    private DriverInfoDtoV2 driverInfo; // 비회원은 이게 곧 신분증입니다.
    // LONG 전용 (개월 수)
    private Integer months;

    private boolean agreement; // 약관 동의 여부

    @Data
    public static class DriverInfoDtoV2 {
        private String lastname;
        private String firstname;
        private String phone;
        private String email;
        private String birth;      // 생년월일 (보험 나이 확인용)
        private String password;   // (추가) 비회원인 경우 예약 조회용 비밀번호
    }
}
