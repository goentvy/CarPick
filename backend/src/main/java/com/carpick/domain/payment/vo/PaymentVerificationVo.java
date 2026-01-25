package com.carpick.domain.payment.vo;

import com.carpick.domain.reservation.enums.ReservationStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class PaymentVerificationVo {
    private Long reservationId;
    private ReservationStatus reservationStatus;
    private BigDecimal totalAmountSnapshot;
    private Long userId; // 권한/로그용 (비회원이면 null)
    private Long vehicleId;
}
