package com.carpick.domain.reservation.service.v2;

import com.carpick.common.vo.Period;
import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.insurance.mapper.InsuranceMapper;
import com.carpick.domain.payment.dto.PaymentSummaryDtoV2;
import com.carpick.domain.price.dto.PriceDisplayDTO;
import com.carpick.domain.price.display.PriceCalculatorService;
import com.carpick.domain.price.display.PriceSummaryService;
import com.carpick.domain.price.dto.ReservationPriceSummaryRequestDto;
import com.carpick.domain.price.dto.ReservationPriceSummaryResponseDto;
import com.carpick.domain.price.reservation.ReservationPriceSnapshotApplier;
import com.carpick.domain.price.reservation.ReservationPriceSummaryService;
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

    /**
     * [의미]
     * - Reservation 엔티티에는 insurance_id(FK)를 저장해야 하므로 보험 옵션 조회는 유지합니다.
     * - 보험료 금액 계산은 Price 모듈(ReservationPriceSummaryService)에서 담당합니다.
     */
    private final InsuranceMapper insuranceMapper;

    /**
     * [수정 포인트]
     * - 기존 display용 PriceSummaryService/PriceCalculatorService/Period/PriceSnapshot 흐름을 제거하고,
     *   "예약용 진짜 가격" 계산은 ReservationPriceSummaryService로 일원화합니다.
     */
    private final ReservationPriceSummaryService reservationPriceSummaryService;

    /**
     * [수정 포인트]
     * - 가격 DTO -> Reservation 스냅샷 컬럼 세팅 책임을 Applier로 분리합니다.
     */
    private final ReservationPriceSnapshotApplier reservationPriceSnapshotApplier;

    @Transactional
    public ReservationCreateResponseDtoV2 createReservation(
            ReservationCreateRequestDtoV2 request,
            Long userId
    ) {
        // 0. 약관 동의 검증 (예약 생성 전 필수)
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

        /**
         * 4. 보험 옵션 조회 (insurance_id 저장 목적)
         *
         * [의미]
         * - 보험 금액 계산은 Price 모듈이 담당하지만, Reservation에는 insurance_id(FK)를 저장해야 합니다.
         * - request의 insuranceCode는 String이므로 DB 조회에는 String 그대로 사용합니다.
         */
        String insuranceCodeStr = (request.getInsuranceCode() == null || request.getInsuranceCode().isBlank())
                ? "NONE"
                : request.getInsuranceCode();

        InsuranceRawDto insurance = insuranceMapper.selectInsuranceByCodeV2(insuranceCodeStr);
        if (insurance == null) {
            throw new IllegalArgumentException("유효하지 않은 보험 코드입니다. insuranceCode=" + insuranceCodeStr);
        }

        /**
         * 5. 예약용 "진짜 가격" 계산 (단기/장기 + 보험 + 쿠폰 + total)
         *
         * [수정 포인트]
         * - 기존: PriceSummaryService(display) + Period + PriceCalculatorService로 직접 계산
         * - 변경: ReservationPriceSummaryService로 가격 계산 책임을 일원화
         *
         * [주의]
         * - request.insuranceCode는 String이므로 InsuranceCode enum으로 변환해서 전달합니다.
         * - enum 매핑이 깨지면 valueOf에서 예외가 나므로, 값이 DB/프런트와 동일한지 확인하세요.
         */
        ReservationPriceSummaryRequestDto priceReq = new ReservationPriceSummaryRequestDto();
        priceReq.setSpecId(request.getSpecId());
        priceReq.setRentType(request.getRentType());
        priceReq.setStartDateTime(request.getStartDateTime());
        priceReq.setEndDateTime(request.getEndDateTime());

        // 장기 months는 현재 ReservationCreateRequestDtoV2에 없으므로 null
        // [의미] 장기 months는 LongRentDurationFactory가 start/end로 fallback 계산합니다.
        priceReq.setMonths(null);

        // 보험코드: String -> Enum (null/blank면 NONE)
        InsuranceCode insuranceCodeEnum = (insuranceCodeStr == null || insuranceCodeStr.isBlank())
                ? InsuranceCode.NONE
                : InsuranceCode.valueOf(insuranceCodeStr);
        priceReq.setInsuranceCode(insuranceCodeEnum);

        // 쿠폰은 MVP에서 미사용이면 null
        priceReq.setCouponCode(null);

        ReservationPriceSummaryResponseDto priceRes = reservationPriceSummaryService.calculate(priceReq);
        log.info("[예약생성] 예약 가격 계산 완료. totalAmount={}", priceRes.getTotalAmount());

        // 6. 예약 Entity 생성 및 INSERT
        String reservationNo = generateReservationNo();

        Reservation reservation = buildReservation(
                request,
                userId,
                vehicleId,
                reservationNo,
                insurance.getInsuranceId()
        );

        /**
         * 7. 스냅샷 세팅 (Applier)
         *
         * [수정 포인트]
         * - 기존: ReservationCreateService 내부에서 snapshot 필드를 일일이 set
         * - 변경: priceRes(DTO)를 Reservation 스냅샷 컬럼에 매핑하는 책임을 Applier로 분리
         */
        reservationPriceSnapshotApplier.apply(reservation, priceRes);

        // 운영/DDL 기준 useYn 세팅
        reservation.setUseYn("Y");

        reservationCreateMapper.insertReservation(reservation);
        log.info("[예약생성] 예약 INSERT 완료. reservationId={}, reservationNo={}",
                reservation.getReservationId(), reservationNo);

        // 8. 응답 생성 (PaymentSummary는 priceRes 기반)
        return buildResponse(reservation, request, priceRes);
    }

    private String generateReservationNo() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    /**
     * Reservation 엔티티 생성 (스냅샷 금액 세팅은 여기서 하지 않음)
     *
     * [의미]
     * - buildReservation은 "누가/언제/어디서/무엇을" 예약했는지의 메타데이터를 세팅한다.
     * - "얼마를"은 ReservationPriceSnapshotApplier가 전담한다.
     */
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

        // 비회원 비밀번호(현재 로직 유지)
        if (userId == null && driver.getPassword() != null) {
            reservation.setNonMemberPassword(driver.getPassword());
            // TODO 운영 시 BCrypt 해시로 저장
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

    /**
     * 응답 생성
     *
     * [수정 포인트]
     * - 기존 snapshot(record) 기반 응답 -> priceRes(DTO) 기반 응답으로 변경
     */
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
