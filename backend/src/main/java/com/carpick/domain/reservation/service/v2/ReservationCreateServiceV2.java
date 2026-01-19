package com.carpick.domain.reservation.service.v2;

import com.carpick.common.vo.Period;
import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.insurance.mapper.InsuranceMapper;
import com.carpick.domain.payment.dto.PaymentSummaryDtoV2;
import com.carpick.domain.price.dto.PriceDisplayDTO;
import com.carpick.domain.price.service.PriceCalculatorService;
import com.carpick.domain.price.service.PriceSummaryService;
import com.carpick.domain.reservation.dtoV2.request.ReservationCreateRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationCreateResponseDtoV2;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.carpick.domain.reservation.mapper.ReservationCreateMapperV2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReservationCreateServiceV2 {

    private final ReservationCreateMapperV2 reservationCreateMapper;
    private final InsuranceMapper insuranceMapper;
    private final PriceSummaryService priceSummaryService;
    private final PriceCalculatorService priceCalculator;

    @Transactional
    public ReservationCreateResponseDtoV2 createReservation(
            ReservationCreateRequestDtoV2 request,
            Long userId
    ) {
        // 0. 약관 동의 검증
        if (!request.isAgreement()) {
            throw new IllegalArgumentException("약관에 동의해주세요.");
        }

        // 1. 예약 가능 차량 조회
        Long vehicleId = reservationCreateMapper.selectAvailableVehicleIdForPeriod(
                request.getPickupBranchId(),
                request.getSpecId(),
                request.getStartDateTime(),
                request.getEndDateTime()
        );

        if (vehicleId == null) {
            throw new IllegalStateException(
                    "해당 기간에 예약 가능한 차량이 없습니다. specId=" + request.getSpecId()
            );
        }

        log.info("[예약생성] 가용 차량 선택 완료. vehicleId={}", vehicleId);

        // 2. 차량 재고 Row Lock 획득 (비관적 락)
        reservationCreateMapper.lockVehicleInventory(vehicleId);
        log.info("[예약생성] 차량 락 획득 완료. vehicleId={}", vehicleId);

        // 3. 예약 기간 겹침 재검증
        int overlapCount = reservationCreateMapper.countOverlappingReservations(
                vehicleId,
                request.getStartDateTime(),
                request.getEndDateTime()
        );

        if (overlapCount > 0) {
            throw new IllegalStateException(
                    "해당 기간에 이미 예약이 존재합니다. vehicleId=" + vehicleId
            );
        }
        log.info("[예약생성] 기간 겹침 검증 통과. overlapCount={}", overlapCount);

        // 4. 가격 계산 및 스냅샷 생성
        Period period = Period.of(request.getStartDateTime(), request.getEndDateTime());

        PriceDisplayDTO priceDisplay = priceSummaryService.calculateDisplayPrice(
                request.getSpecId(),
                request.getPickupBranchId(),
                period,
                null,  // couponCode
                null,  // rentType (자동 판단)
                null   // rentMonths
        );

        // (1) insuranceCode null/blank 방어 → NONE
        String insuranceCode = (request.getInsuranceCode() == null || request.getInsuranceCode().isBlank())
                ? "NONE"
                : request.getInsuranceCode();

        InsuranceRawDto insurance = insuranceMapper.selectInsuranceByCodeV2(insuranceCode);

        if (insurance == null) {
            throw new IllegalArgumentException(
                    "유효하지 않은 보험 코드입니다. insuranceCode=" + insuranceCode
            );
        }

        PriceSnapshot snapshot = calculatePriceSnapshot(priceDisplay, insurance, period);
        log.info("[예약생성] 가격 스냅샷 생성 완료. totalAmount={}", snapshot.totalAmount);

        // 5. 예약 Entity 생성 및 INSERT
        String reservationNo = generateReservationNo();

        Reservation reservation = buildReservation(
                request,
                userId,
                vehicleId,
                reservationNo,
                insurance.getInsuranceId(),
                snapshot
        );

        // (4) useYn 세팅 (DDL/운영 기준)
        reservation.setUseYn("Y");

        reservationCreateMapper.insertReservation(reservation);
        log.info("[예약생성] 예약 INSERT 완료. reservationId={}, reservationNo={}",
                reservation.getReservationId(), reservationNo);

        // 6. 응답 생성
        return buildResponse(reservation, request, snapshot);
    }

    private String generateReservationNo() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    private PriceSnapshot calculatePriceSnapshot(
            PriceDisplayDTO priceDisplay,
            InsuranceRawDto insurance,
            Period period
    ) {
        // 기본 대여료 (일수 + 시간 요금)
        BigDecimal baseRentFee = priceCalculator.calculateTotalAmount(
                priceDisplay.getDisplayUnitPrice(),
                period.getRentDays(),
                period.getRentRemainHours()
        );

        // (5) 보험 extraDailyPrice null 가드
        BigDecimal dailyInsurance = (insurance.getExtraDailyPrice() == null)
                ? BigDecimal.ZERO
                : insurance.getExtraDailyPrice();

        int billingDays = (int) period.getRentDaysForBilling();
        BigDecimal baseInsuranceFee = dailyInsurance.multiply(BigDecimal.valueOf(billingDays));

        BigDecimal totalAmount = baseRentFee.add(baseInsuranceFee);

        return new PriceSnapshot(
                baseRentFee,
                BigDecimal.ZERO,
                baseInsuranceFee,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                totalAmount,
                baseRentFee,
                baseInsuranceFee
        );
    }

    private Reservation buildReservation(
            ReservationCreateRequestDtoV2 request,
            Long userId,
            Long vehicleId,
            String reservationNo,
            Long insuranceId,
            PriceSnapshot snapshot
    ) {
        Reservation reservation = new Reservation();

        reservation.setReservationNo(reservationNo);

        // WHO
        reservation.setUserId(userId);
        reservation.setVehicleId(vehicleId);

        // DRIVER
        ReservationCreateRequestDtoV2.DriverInfoDtoV2 driver = request.getDriverInfo();
        reservation.setDriverLastName(driver.getLastname());
        reservation.setDriverFirstName(driver.getFirstname());

        LocalDate birth = parseBirthdate(driver.getBirth());
        // (6) birth 파싱 실패(null)면 DB NOT NULL이라 결국 터지므로 여기서 막기
        if (birth == null) {
            throw new IllegalArgumentException("생년월일 형식이 올바르지 않습니다. birth=" + driver.getBirth());
        }
        reservation.setDriverBirthdate(birth);

        reservation.setDriverPhone(driver.getPhone());
        reservation.setDriverEmail(driver.getEmail());

        // 비회원 비밀번호
        if (userId == null && driver.getPassword() != null) {
            reservation.setNonMemberPassword(driver.getPassword());
            // TODO: 운영 시 BCrypt 해시로 저장
            // TODO: [보안] 추후 Spring Security 적용 시 암호화 필요 (BCrypt)
        }

        // WHEN
        reservation.setStartDate(request.getStartDateTime());
        reservation.setEndDate(request.getEndDateTime());

        // (2) pickupType null 방어
        PickupType pickupType = (request.getPickupType() != null) ? request.getPickupType() : PickupType.VISIT;
        reservation.setPickupType(pickupType);
        reservation.setPickupBranchId(request.getPickupBranchId());

        // (2) returnType null 방어
        ReturnTypes returnType = (request.getReturnType() != null) ? request.getReturnType() : ReturnTypes.VISIT;
        reservation.setReturnType(returnType);

        // (3) DROPZONE 분기 처리
        if (returnType == ReturnTypes.DROPZONE) {
            if (request.getDropzoneId() == null) {
                throw new IllegalArgumentException("드롭존 반납이면 dropzoneId는 필수입니다.");
            }
            reservation.setReturnBranchId(null);
            reservation.setReturnDropzoneId(request.getDropzoneId());
        } else {
            // VISIT
            Long returnBranchId = (request.getReturnBranchId() != null)
                    ? request.getReturnBranchId()
                    : request.getPickupBranchId();
            reservation.setReturnBranchId(returnBranchId);
            reservation.setReturnDropzoneId(null);
        }

        // WHAT & HOW MUCH
        reservation.setInsuranceId(insuranceId);
        reservation.setCouponId(null);

        reservation.setBaseRentFeeSnapshot(snapshot.baseRentFee);
        reservation.setRentDiscountAmountSnapshot(snapshot.rentDiscountAmount);

        reservation.setBaseInsuranceFeeSnapshot(snapshot.baseInsuranceFee);
        reservation.setInsuranceDiscountAmountSnapshot(snapshot.insuranceDiscountAmount);

        reservation.setOptionFeeSnapshot(snapshot.optionFee);
        reservation.setCouponDiscountSnapshot(snapshot.couponDiscount);

        reservation.setMemberDiscountRateSnapshot(snapshot.memberDiscountRate);
        reservation.setEventDiscountAmountSnapshot(snapshot.eventDiscountAmount);

        reservation.setTotalAmountSnapshot(snapshot.totalAmount);
        reservation.setAppliedRentFeeSnapshot(snapshot.appliedRentFee);
        reservation.setAppliedInsuranceFeeSnapshot(snapshot.appliedInsuranceFee);

        reservation.setAgreementYn(request.isAgreement() ? "Y" : "N");
        reservation.setReservationStatus(ReservationStatus.PENDING);

        return reservation;
    }

    private LocalDate parseBirthdate(String birth) {
        if (birth == null || birth.isBlank()) {
            return null;
        }
        try {
            String cleaned = birth.replace("-", "");
            return LocalDate.parse(cleaned, DateTimeFormatter.ofPattern("yyyyMMdd"));
        } catch (Exception e) {
            log.warn("생년월일 파싱 실패. birth={}", birth);
            return null;
        }
    }

    private ReservationCreateResponseDtoV2 buildResponse(
            Reservation reservation,
            ReservationCreateRequestDtoV2 request,
            PriceSnapshot snapshot
    ) {
        ReservationCreateResponseDtoV2 response = new ReservationCreateResponseDtoV2();

        response.setReservationNo(reservation.getReservationNo());
        response.setInsuranceCode(request.getInsuranceCode());
        response.setSpecId(request.getSpecId());
        response.setMessage("예약이 생성되었습니다. 결제를 진행해주세요.");

        PaymentSummaryDtoV2 paymentSummary = PaymentSummaryDtoV2.builder()
                .basePrice(snapshot.baseRentFee.intValue())
                .insuranceTotalPrice(snapshot.baseInsuranceFee.intValue())
                .discountTotalPrice(0)
                .finalTotalPrice(snapshot.totalAmount.intValue())
                .currency("KRW")
                .build();

        response.setPaymentSummary(paymentSummary);

        return response;
    }

    private record PriceSnapshot(
            BigDecimal baseRentFee,
            BigDecimal rentDiscountAmount,
            BigDecimal baseInsuranceFee,
            BigDecimal insuranceDiscountAmount,
            BigDecimal optionFee,
            BigDecimal couponDiscount,
            BigDecimal memberDiscountRate,
            BigDecimal eventDiscountAmount,
            BigDecimal totalAmount,
            BigDecimal appliedRentFee,
            BigDecimal appliedInsuranceFee
    ) {}
}
