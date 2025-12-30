package com.carpick.domain.reservation.service;

import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationCreateResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.enums.ActorType;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import com.carpick.domain.reservationHistory.entity.ReservationStatusHistory;
import com.carpick.domain.reservationHistory.mapper.ReservationStatusHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ReservationCommandService {

    private final ReservationMapper reservationMapper;
    private final ReservationStatusHistoryMapper historyMapper;
    private final ReservationPriceService pricingService;

    private static final DateTimeFormatter DATETIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public ReservationCreateResponseDto createReservation(
            ReservationCreateRequestDto req, Long userId) {

        // 1️⃣ 날짜 파싱 (프론트 합의 포맷)
        LocalDateTime startDate =
                LocalDateTime.parse(req.getStartDateTime(), DATETIME_FORMATTER);
        LocalDateTime endDate =
                LocalDateTime.parse(req.getEndDateTime(), DATETIME_FORMATTER);

        // 2️⃣ 가격 재계산 (서버 기준)
        ReservationPriceResponseDto price =
                pricingService.estimate(
                        req.getCarId(),
                        req.getInsuranceCode(),
                        req.getStartDateTime(),
                        req.getEndDateTime()
                );

        // 3️⃣ 예약번호 생성 (여기서만)
        String reservationNo = "R-" + System.currentTimeMillis();

        boolean isDelivery = "delivery".equalsIgnoreCase(req.getMethod());

        // 4️⃣ Reservation 엔티티 구성 (🔥 엔티티 기준)
        Reservation r = new Reservation();
        r.setReservationNo(reservationNo);
        r.setUserId(userId);
        Long vehicleId = reservationMapper.selectAvailableVehicleIdBySpecId(req.getCarId());
        if (vehicleId == null) {
            throw new IllegalStateException("예약 가능한 차량 재고가 없습니다. specId(carId)=" + req.getCarId());
        }
        r.setVehicleId(vehicleId);

        // DRIVER
        r.setDriverLastName(req.getDriverInfo().getLastname());
        r.setDriverFirstName(req.getDriverInfo().getFirstname());
        r.setDriverPhone(req.getDriverInfo().getPhone());
        r.setDriverEmail(req.getDriverInfo().getEmail());

        if (req.getDriverInfo().getBirth() != null) {
            r.setDriverBirthdate(LocalDate.parse(req.getDriverInfo().getBirth()));
        }

        // WHEN
        r.setStartDate(startDate);
        r.setEndDate(endDate);

        // WHERE (ENUM)
        r.setPickupType(isDelivery ? PickupType.DELIVERY : PickupType.VISIT);
        r.setPickupBranchId(req.getPickUpBranchId());
        r.setPickupAddress(null);

        r.setReturnType(isDelivery ? ReturnTypes.COLLECTION : ReturnTypes.VISIT);
        r.setReturnBranchId(req.getReturnBranchId());
        r.setReturnAddress(null);

        // SNAPSHOT (BigDecimal)
        r.setBaseRentFeeSnapshot(BigDecimal.valueOf(price.getCarDailyPrice()));
        r.setRentDiscountAmountSnapshot(BigDecimal.ZERO);

        r.setBaseInsuranceFeeSnapshot(BigDecimal.valueOf(price.getInsurancePrice()));
        r.setInsuranceDiscountAmountSnapshot(BigDecimal.ZERO);

        r.setOptionFeeSnapshot(BigDecimal.ZERO);
        r.setCouponDiscountSnapshot(BigDecimal.ZERO);

        r.setMemberDiscountRateSnapshot(BigDecimal.ZERO);
        r.setEventDiscountAmountSnapshot(BigDecimal.ZERO);

        r.setTotalAmountSnapshot(BigDecimal.valueOf(price.getTotalPrice()));
        r.setAppliedRentFeeSnapshot(BigDecimal.valueOf(price.getCarDailyPrice()));
        r.setAppliedInsuranceFeeSnapshot(BigDecimal.valueOf(price.getInsurancePrice()));

        r.setAgreementYn("Y");
        r.setReservationStatus(ReservationStatus.PENDING);
        r.setUseYn("Y");

        // 5️⃣ 저장
        reservationMapper.insertReservation(r);

        // 6️⃣ 상태 이력 (무조건 1건)
        ReservationStatusHistory history = ReservationStatusHistory.builder()
                .reservationId(r.getReservationId())
                .statusPrev(null)
                .statusCurr(ReservationStatus.PENDING)
                .actorType(ActorType.SYSTEM)
                .actorId("SYSTEM")
                .reason("예약 생성")
                .build();

        historyMapper.insertHistory(history);

        // 7️⃣ 응답
        return new ReservationCreateResponseDto(
                reservationNo,
                req.getCarId(),
                req.getInsuranceCode(),
                price.getCarDailyPrice(),
                price.getInsurancePrice(),
                price.getTotalPrice(),
                "예약이 완료 되었습니다."
        );
    }

}
