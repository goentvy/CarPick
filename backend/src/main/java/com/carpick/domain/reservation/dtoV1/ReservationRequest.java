package com.carpick.domain.reservation.dtoV1;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservationRequest {

    @NotNull
    @Valid
    private DriverInfo driverInfo;

    @NotNull
    @Valid
    private PickupReturn pickupReturn;

    @NotNull
    @Valid
    private InsuranceInfo insuranceInfo;

    @NotNull
    @Valid
    private PaymentSummary paymentSummary;

    @NotNull
    @Valid
    private CardPayment cardPayment;

    @AssertTrue
    private boolean agreement;

    // =======================

    @Data
    public static class DriverInfo {

        @NotBlank
        private String firstName;

        @NotBlank
        private String lastName;

        @NotBlank
        private String birth;

        @NotBlank
        private String phone;

        @NotBlank
        private String email;
    }

    @Data
    public static class InsuranceInfo {

        @NotBlank
        private String type;

        @NotBlank
        private String coverage;

        @Min(0)
        private int fee;
    }

    @Data
    public static class PickupReturn {

        @NotBlank
        private String method;

        @NotBlank
        private String branch;

        @NotBlank
        private String time;

        private String deliveryOption;
    }

    @Data
    public static class PaymentSummary {

        @Min(0)
        private int carFee;

        @Min(0)
        private int insuranceFee;

        @Min(0)
        private int total;
    }

    @Data
    public static class CardPayment {

        @NotBlank
        private String cardNumber;

        @NotBlank
        private String expiry;

        @NotBlank
        private String cvc;

        @NotBlank
        private String password2;

        @NotBlank
        private String cardType;

        private String installment;

        @AssertTrue
        private boolean agree;
    }
}

