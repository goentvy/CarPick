package com.carpick.domain.reservation.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservationRequest {
    private DriverInfo driverInfo;
    private PickupReturn pickupReturn;
    private InsuranceInfo insuranceInfo;
    private PaymentSummary paymentSummary;
    private CardPayment cardPayment;
    private boolean agreement;

    @Data
    public static class DriverInfo {
        private String firstName;
        private String lastName;
        private String birth;
        private String phone;
        private String email;
    }

    @Data
    public static class InsuranceInfo {
        private String type;
        private String coverage;
        private int fee;
    }

    @Data
    public static class PickupReturn {
        private String method;
        private String branch;
        private String time;
        private String deliveryOption;
    }

    @Data
    public static class PaymentSummary {
        private int carFee;
        private int insuranceFee;
        private int total;
    }

    @Data
    public static class CardPayment {
        private String cardNumber;
        private String expiry;
        private String cvc;
        private String password2;
        private String cardType;
        private String installment;
        private boolean agree;
    }
}
