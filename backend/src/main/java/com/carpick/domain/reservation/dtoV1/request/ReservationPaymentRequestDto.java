package com.carpick.domain.reservation.dtoV1.request;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ReservationPaymentRequestDto {
    // 1. Create 단계에서 받은 예약 번호 (또는 ID)
    // DB 조회용으로 PK(Long)를 쓸지, 문자열(String)을 쓸지 결정해서 하나만 쓰세요.
    private Long reservationId;


     private String reservationNo;

    // 2. 결제 정보 (스크린샷에 있는 cardPayment 객체만 가져옴)

    @Valid
    @NotNull
    private CardPayment cardPayment;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class CardPayment {

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
