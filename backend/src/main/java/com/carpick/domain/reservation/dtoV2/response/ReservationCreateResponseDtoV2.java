package com.carpick.domain.reservation.dtoV2.response;

import com.carpick.domain.payment.dto.PaymentSummaryDtoV2;
import lombok.Data;

@Data
public class ReservationCreateResponseDtoV2 {
    private String reservationNo; // 예약번호
    private String insuranceCode;
    private Long specId;
    private PaymentSummaryDtoV2 paymentSummary; // 여기로 몰아넣기
    private String message;

}
