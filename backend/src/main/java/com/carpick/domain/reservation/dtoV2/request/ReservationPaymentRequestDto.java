package com.carpick.domain.reservation.dtoV2.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ReservationPaymentRequestDto {
//    사용자가 결제 화면에서 입력한 결제정보를 가지고, 어떤 예약(reservation)을 결제할지 식별해서 ‘결제 승인/예약 확정’을 요청하는 DTO
@NotBlank(message = "예약번호(reservationNo)는 필수입니다.")
    private String reservationNo;
    @Valid
    @NotNull
    private CardPaymentV2 cardPayment;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class CardPaymentV2 {

        @NotBlank(message = "카드 번호를 입력해주세요.")
        private String cardNumber;
        @NotBlank(message = "유효기간을 입력해주세요.")
        private String expiry;
        @NotBlank(message = "CVC를 입력해주세요.")
        private String cvc;
        @NotBlank(message = "비밀번호 앞 2자리를 입력해주세요.")
        private String password2;
        private String installment; // 할부
        private String cardType;    // personal 등
        private boolean agree;
    }

}
