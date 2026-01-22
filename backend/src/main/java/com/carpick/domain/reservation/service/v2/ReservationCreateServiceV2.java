package com.carpick.domain.reservation.service.v2;

import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.insurance.mapper.InsuranceMapper;
import com.carpick.domain.payment.dto.PaymentSummaryDtoV2;
import com.carpick.domain.price.dto.ReservationPriceSummaryRequestDto;
import com.carpick.domain.price.dto.ReservationPriceSummaryResponseDto;
import com.carpick.domain.price.entity.ReservationPriceDetail;
import com.carpick.domain.price.longTerm.duration.LongRentDuration;
import com.carpick.domain.price.longTerm.duration.LongRentDurationFactory;
import com.carpick.domain.price.reservation.ReservationPriceSnapshotApplier;
import com.carpick.domain.price.reservation.ReservationPriceSummaryService;
import com.carpick.domain.price.service.ReservationPriceStatementService;
import com.carpick.domain.price.shortTerm.duration.ShortRentDuration;
import com.carpick.domain.price.shortTerm.duration.ShortRentDurationFactory;
import com.carpick.domain.reservation.dtoV2.request.ReservationCreateRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationCreateResponseDtoV2;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.RentType;
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

    private final ReservationPriceSummaryService reservationPriceSummaryService;
    private final ReservationPriceSnapshotApplier reservationPriceSnapshotApplier;

    // [추가] 가격 명세서 저장 서비스
    private final ReservationPriceStatementService reservationPriceStatementService;

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
            throw new IllegalStateException("해당 기간에 예약 가능한 차량이 없습니다. specId=" + request.getSpecId());
        }
        log.info("[예약생성] 가용 차량 선택 완료. vehicleId={}", vehicleId);

        // 2. 차량 재고 Row Lock
        reservationCreateMapper.lockVehicleInventory(vehicleId);
        log.info("[예약생성] 차량 락 획득 완료. vehicleId={}", vehicleId);

        // 3. 기간 겹침 재검증
        int overlapCount = reservationCreateMapper.countOverlappingReservations(
                vehicleId,
                request.getStartDateTime(),
                request.getEndDateTime()
        );
        if (overlapCount > 0) {
            throw new IllegalStateException("해당 기간에 이미 예약이 존재합니다. vehicleId=" + vehicleId);
        }
        log.info("[예약생성] 기간 겹침 검증 통과. overlapCount={}", overlapCount);

        // 4. 보험 옵션 조회 (insurance_id 저장 목적)
        String insuranceCodeStr = (request.getInsuranceCode() == null || request.getInsuranceCode().isBlank())
                ? "NONE"
                : request.getInsuranceCode();

        InsuranceRawDto insurance = insuranceMapper.selectInsuranceByCodeV2(insuranceCodeStr);
        if (insurance == null) {
            throw new IllegalArgumentException("유효하지 않은 보험 코드입니다. insuranceCode=" + insuranceCodeStr);
        }

        // 5. 예약용 가격 계산
        ReservationPriceSummaryRequestDto priceReq = new ReservationPriceSummaryRequestDto();
        priceReq.setSpecId(request.getSpecId());
        priceReq.setRentType(request.getRentType());
        priceReq.setStartDateTime(request.getStartDateTime());
        priceReq.setEndDateTime(request.getEndDateTime());

        // [수정] request.getMonths()는 DTO에 없으므로 사용 금지
        //        LONG이면 LongRentDurationFactory가 날짜로 months를 fallback 계산
        if (request.getRentType() == RentType.LONG) {
            LongRentDuration duration = LongRentDurationFactory.from(
                    null, // [수정] request.getMonths() 제거
                    request.getStartDateTime(),
                    request.getEndDateTime()
            );
            // [수정] record라면 duration.months()가 getter
            priceReq.setMonths(duration.months());
        } else {
            priceReq.setMonths(null);
        }

        // 보험코드: String -> Enum
        InsuranceCode insuranceCodeEnum = (insuranceCodeStr == null || insuranceCodeStr.isBlank())
                ? InsuranceCode.NONE
                : InsuranceCode.valueOf(insuranceCodeStr);
        priceReq.setInsuranceCode(insuranceCodeEnum);

        // 쿠폰은 MVP 미사용
        priceReq.setCouponCode(null);

        ReservationPriceSummaryResponseDto priceRes = reservationPriceSummaryService.calculate(priceReq);
        log.info("[예약생성] 예약 가격 계산 완료. totalAmount={}", priceRes.getTotalAmount());

        // 6. 예약 Entity 생성
        String reservationNo = generateReservationNo();

        Reservation reservation = buildReservation(
                request,
                userId,
                vehicleId,
                reservationNo,
                insurance.getInsuranceId()
        );

        // [수정] Reservation 스냅샷은 reservation INSERT 전에 세팅해야 같이 들어감
        reservationPriceSnapshotApplier.apply(reservation, priceRes);
        reservation.setUseYn("Y");

        // 7. 예약 INSERT (여기서 reservationId 생성)
        reservationCreateMapper.insertReservation(reservation);
        log.info("[예약생성] 예약 INSERT 완료. reservationId={}, reservationNo={}",
                reservation.getReservationId(), reservationNo);

        // [수정] 가격 명세서는 reservationId(FK)가 필요하므로 INSERT 이후 저장
        ReservationPriceDetail detail = buildPriceDetail(request, priceReq, priceRes, reservation.getReservationId());
        reservationPriceStatementService.save(detail);
        log.info("[예약생성] 가격 명세서 저장 완료. reservationId={}", reservation.getReservationId());

        // 8. 응답
        return buildResponse(reservation, request, priceRes);
    }

    /**
     * [수정] appliedDays/appliedHours/insuranceAppliedDays 를 0 하드코딩하지 않고,
     *       "계산 규칙이 만든 기간"을 저장합니다.
     */
    private ReservationPriceDetail buildPriceDetail(
            ReservationCreateRequestDtoV2 request,
            ReservationPriceSummaryRequestDto priceReq,
            ReservationPriceSummaryResponseDto priceRes,
            Long reservationId
    ) {
        ReservationPriceDetail d = new ReservationPriceDetail();

        d.setReservationId(reservationId);

        // 결과 금액
        d.setReservationRentFee(priceRes.getRentFee());
        d.setReservationInsuranceFee(priceRes.getInsuranceFee());
        d.setReservationCouponDiscount(priceRes.getCouponDiscount());
        d.setReservationTotalAmount(priceRes.getTotalAmount());

        // 요금제 타입
        d.setPriceType(request.getRentType() == null ? null : request.getRentType().name());

        // 단가 스냅샷 (MVP: 계산 결과만 있으면 0으로 두고, 나중에 확장)
        d.setAppliedDailyPrice(BigDecimal.ZERO);
        d.setAppliedHourlyPrice(BigDecimal.ZERO);
        d.setAppliedMonthlyPrice(BigDecimal.ZERO);

        RentType rentType = (priceReq.getRentType() == null) ? RentType.SHORT : priceReq.getRentType();

        if (rentType == RentType.SHORT) {
            // [수정] ChronoUnit으로 대충 일수 내지 말고,
            //        단기 계산 규칙이 만든 duration을 그대로 저장
            ShortRentDuration duration = ShortRentDurationFactory.from(
                    priceReq.getStartDateTime(),
                    priceReq.getEndDateTime()
            );

            // [수정] daysPart()/hoursPart()는 long -> Integer로 변환 필요 (컴파일 에러 해결)
            int appliedDays = Math.toIntExact(duration.daysPart());
            int appliedHours = Math.toIntExact(duration.hoursPart());

            d.setAppliedDays(appliedDays);
            d.setAppliedHours(appliedHours);
            d.setAppliedMonths(0);

            // [수정] getInsuranceDays() 같은 메서드는 없음 -> 보험일수는 "올림" 규칙으로 직접 계산
            // 정책: 하루(1440분) 기준으로 올림
            long totalMinutes = duration.totalMinutes(); // record component 접근
            int insuranceDays = (int) ((totalMinutes + 1440 - 1) / 1440); // ceil(totalMinutes/1440)
            if (insuranceDays < 0) insuranceDays = 0;

            d.setInsuranceAppliedDays(insuranceDays);

        } else {
            // LONG: months는 priceReq에 이미 결정되어 있음
            Integer months = priceReq.getMonths();
            d.setAppliedMonths(months == null ? 0 : months);

            d.setAppliedDays(0);
            d.setAppliedHours(0);

            // 장기는 보험을 MVP로 계산하더라도 "보험일수 근거"는 의미가 애매해서 0 유지
            d.setInsuranceAppliedDays(0);
        }

        return d;
    }

    private String generateReservationNo() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    private Reservation buildReservation(
            ReservationCreateRequestDtoV2 request,
            Long userId,
            Long vehicleId,
            String reservationNo,
            Long insuranceId
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
        if (birth == null) {
            throw new IllegalArgumentException("생년월일 형식이 올바르지 않습니다. birth=" + driver.getBirth());
        }
        reservation.setDriverBirthdate(birth);

        reservation.setDriverPhone(driver.getPhone());
        reservation.setDriverEmail(driver.getEmail());

        if (userId == null && driver.getPassword() != null) {
            reservation.setNonMemberPassword(driver.getPassword());
            // TODO BCrypt
        }

        // WHEN
        reservation.setStartDate(request.getStartDateTime());
        reservation.setEndDate(request.getEndDateTime());

        // WHERE & HOW
        PickupType pickupType = (request.getPickupType() != null) ? request.getPickupType() : PickupType.VISIT;
        reservation.setPickupType(pickupType);
        reservation.setPickupBranchId(request.getPickupBranchId());

        ReturnTypes returnType = (request.getReturnType() != null) ? request.getReturnType() : ReturnTypes.VISIT;
        reservation.setReturnType(returnType);

        if (returnType == ReturnTypes.DROPZONE) {
            if (request.getDropzoneId() == null) {
                throw new IllegalArgumentException("드롭존 반납이면 dropzoneId는 필수입니다.");
            }
            reservation.setReturnBranchId(null);
            reservation.setReturnDropzoneId(request.getDropzoneId());
        } else {
            Long returnBranchId = (request.getReturnBranchId() != null)
                    ? request.getReturnBranchId()
                    : request.getPickupBranchId();
            reservation.setReturnBranchId(returnBranchId);
            reservation.setReturnDropzoneId(null);
        }

        // WHAT
        reservation.setInsuranceId(insuranceId);
        reservation.setCouponId(null);

        reservation.setAgreementYn(request.isAgreement() ? "Y" : "N");
        reservation.setReservationStatus(ReservationStatus.PENDING);

        return reservation;
    }

    private LocalDate parseBirthdate(String birth) {
        if (birth == null || birth.isBlank()) return null;
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
            ReservationPriceSummaryResponseDto priceRes
    ) {
        ReservationCreateResponseDtoV2 response = new ReservationCreateResponseDtoV2();

        response.setReservationNo(reservation.getReservationNo());
        response.setInsuranceCode(request.getInsuranceCode());
        response.setSpecId(request.getSpecId());
        response.setMessage("예약이 생성되었습니다. 결제를 진행해주세요.");

        PaymentSummaryDtoV2 paymentSummary = PaymentSummaryDtoV2.builder()
                .basePrice(priceRes.getRentFee().intValue())
                .insuranceTotalPrice(priceRes.getInsuranceFee().intValue())
                .discountTotalPrice(priceRes.getCouponDiscount().intValue())
                .finalTotalPrice(priceRes.getTotalAmount().intValue())
                .currency("KRW")
                .build();

        response.setPaymentSummary(paymentSummary);
        return response;
    }
}