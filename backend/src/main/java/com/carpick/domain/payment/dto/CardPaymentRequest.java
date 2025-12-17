package com.carpick.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardPaymentRequest {
    @NotBlank(message = "카드번호는 필수입니다.")
    @Pattern(regexp = "\\d{4}-\\d{4}-\\d{4}-\\d{4}", message = "카드번호 형식이 올바르지 않습니다.")
    private String cardNumber;

    @NotBlank(message = "유효기간은 필수입니다.")
    @Pattern(regexp = "\\d{2}/\\d{2}", message = "유효기간은 MM/YY 형식이어야 합니다.")
    private String expiry;

    @NotBlank(message = "CVC는 필수입니다.")
    @Size(min = 3, max = 3, message = "CVC는 3자리 숫자여야 합니다.")
    private String cvc;

    @NotBlank(message = "비밀번호 앞 2자리는 필수입니다.")
    @Size(min = 2, max = 2, message = "비밀번호 앞 2자리는 2자리 숫자여야 합니다.")
    private String password2;

    @NotBlank(message = "카드 종류는 필수입니다.")
    private String cardType; // personal / corporate

    @NotBlank(message = "할부기간은 필수입니다.")
    private String installment;

    @Min(value = 1000, message = "결제금액은 1000원 이상이어야 합니다.")
    private int amount;

    @AssertTrue(message = "개인정보 수집 및 이용에 동의해야 결제가 가능합니다.")
    private boolean agree;
}
