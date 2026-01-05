package com.carpick.domain.reservation.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationPayResponseDto {
    /*
     * 1. 결제 처리 상태 (핵심)
     * 역할: 프론트엔드가 성공/실패 분기를 태우는 기준값
     * 예시 값: "APPROVED" (성공), "DECLINED" (거절), "ERROR" (오류)
     */
    private String status;

    /*
     * 2. 사용자 안내 메시지
     * 역할: 사용자에게 보여줄 팝업이나 토스트 메시지 내용
     * 예시 값: "결제가 정상적으로 완료되었습니다." / "잔액이 부족합니다."
     */
    private String message;

    /*
     * 3. 최종 예약 번호
     * 역할: 결제 성공 후 '마이페이지'나 '예약 상세 내역'으로 이동할 때 사용하는 키값
     * 예시 값: "20251231-001" (문자열) 또는 "152" (DB PK)
     * (실패 시에는 null이 될 수도 있음)
     */
    private String reservationNo;

}
