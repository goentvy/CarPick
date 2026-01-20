package com.carpick.domain.reservation.service.v2;


import com.carpick.common.vo.Period;
import com.carpick.domain.branch.dto.BranchZoneDetailDto;
import com.carpick.domain.branch.mapper.BranchMapper;
import com.carpick.domain.car.dto.raw.CarDetailRawDto;
import com.carpick.domain.car.mapper.CarMapper;
import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.insurance.mapper.InsuranceMapper;
import com.carpick.domain.payment.dto.PaymentSummaryDtoV2;
import com.carpick.domain.price.dto.PriceDisplayDTO;
import com.carpick.domain.price.display.PriceCalculatorService;
import com.carpick.domain.price.display.PriceSummaryService;
import com.carpick.domain.reservation.dtoV2.request.ReservationFormRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationFormResponseDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationFormResponseDtoV2.*;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.ReturnTypes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationFormServiceV2 {
    // ============================================================
    // 의존성 주입
    // ============================================================
    private final CarMapper carMapper;
    private final BranchMapper branchMapper;
    private final InsuranceMapper insuranceMapper;
    private final PriceSummaryService priceSummaryService;
    private final PriceCalculatorService priceCalculator;

    // ============================================================
    // Public Methods
    // ============================================================

    /**
     * [메인] 예약 폼 화면 데이터 조회
     *
     * @param request 프론트에서 전달받은 요청 (specId, pickupBranchId, 기간 등)
     * @return 예약 폼 화면 구성에 필요한 전체 데이터
     */
    public ReservationFormResponseDtoV2 getReservationForm(ReservationFormRequestDtoV2 request) {

        // ========================================
        // 1. 차량 정보 조회
        //    - specId로 차량 스펙 정보 가져오기
        //    - 차량명, 이미지, 연료타입 등
        // ========================================
        CarDetailRawDto carDetail = carMapper.selectCarDetailV2(
                request.getSpecId(),
                request.getPickupBranchId()
        );

        if (carDetail == null) {
            throw new IllegalArgumentException(
                    "차량 정보를 찾을 수 없습니다. specId=" + request.getSpecId()
            );
        }

        ReservationFormResponseDtoV2.CarSummaryDtoV2 carSummary = buildCarSummary(carDetail);

        // ========================================
        // 2. 픽업 지점 정보 조회
        //    - pickupBranchId로 지점 상세 정보 가져오기
        //    - 지점명, 주소, 연락처 등
        // ========================================
        BranchZoneDetailDto pickupBranch = branchMapper.findForZoneDetail(
                request.getPickupBranchId()
        );

        if (pickupBranch == null) {
            throw new IllegalArgumentException(
                    "픽업 지점을 찾을 수 없습니다. branchId=" + request.getPickupBranchId()
            );
        }

        PickupLocationDtoV2 pickupLocation = buildPickupLocation(pickupBranch);

        // ========================================
        // 3. 반납 지점 정보 조회
        //    - 현재는 픽업 지점 = 반납 지점 (동일)
        //    - 추후 returnBranchId 추가 시 분리 가능
        // ========================================
        ReturnLocationDtoV2 returnLocation = buildReturnLocation(pickupBranch);

        // ========================================
        // 4. 보험 옵션 목록 조회
        //    - 전체 보험 옵션 리스트 (NONE, NORMAL, FULL)
        //    - 각 옵션별 1일 추가금, 설명 등
        // ========================================
        List<InsuranceRawDto> insuranceRawList = insuranceMapper.selectInsuranceOptionsV2();
        List<InsuranceOptionDtoV2> insuranceOptions = buildInsuranceOptions(insuranceRawList);

        // ========================================
        // 5. 가격 계산 (PriceSummaryService 위임)
        //    - 렌트 타입, 기간 기반 총액 계산
        //    - 폼 초기에는 보험 NONE 상태
        // ========================================
        Period period = Period.of(request.getStartAt(), request.getEndAt());

        PriceDisplayDTO priceDisplay = priceSummaryService.calculateDisplayPrice(
                request.getSpecId(),
                request.getPickupBranchId(),
                period,
                null,  // couponCode (폼 단계에서는 미적용)
                request.getRentType(),
                null   // rentMonths (단기는 null)
        );

        PaymentSummaryDtoV2 paymentSummary = buildPaymentSummary(priceDisplay, period);

        // ========================================
        // 6. 최종 응답 조립
        // ========================================
        return new ReservationFormResponseDtoV2(
                carSummary,
                insuranceOptions,
                paymentSummary,
                pickupLocation,
                returnLocation
        );
    }

    /**
     * [보험 선택] 보험 변경 시 가격 재계산
     *
     * @param request 기존 폼 요청 데이터
     * @param insuranceCode 선택한 보험 코드 (NONE / NORMAL / FULL)
     * @return 재계산된 결제 요약 정보
     */
    public PaymentSummaryDtoV2 recalculateWithInsurance(
            ReservationFormRequestDtoV2 request,
            String insuranceCode
    ) {
        // ========================================
        // 1. 기간 정보 계산
        // ========================================
        Period period = Period.of(request.getStartAt(), request.getEndAt());
        long days = period.getRentDays();
        long hours = period.getRentRemainHours();

        // ========================================
        // 2. 기본 가격 계산 (PriceSummaryService)
        // ========================================
        PriceDisplayDTO priceDisplay = priceSummaryService.calculateDisplayPrice(
                request.getSpecId(),
                request.getPickupBranchId(),
                period,
                null,
                request.getRentType(),
                null
        );

        // ========================================
        // 3. 보험 가격 조회
        // ========================================
        InsuranceRawDto insurance = insuranceMapper.selectInsuranceByCodeV2(insuranceCode);
        int insuranceDailyPrice = (insurance != null)
                ? insurance.getExtraDailyPrice().intValue()
                : 0;

        // ========================================
        // 4. 보험 총액 계산 (1일 보험료 × 일수)
        //    - 시간 요금은 보험에 미적용 (정책)
        // ========================================
        int insuranceTotalPrice = insuranceDailyPrice * (int)period.getRentDaysForBilling();

        // ========================================
        // 5. PaymentSummary 빌드 및 보험 금액 반영
        // ========================================
        PaymentSummaryDtoV2 dto = buildPaymentSummary(priceDisplay, period);
        dto.setInsuranceTotalPrice(insuranceTotalPrice);

        // 최종 금액 = 기본금액 + 보험금액 - 할인금액
        int finalTotal = dto.getBasePrice() + insuranceTotalPrice - dto.getDiscountTotalPrice();
        dto.setFinalTotalPrice(finalTotal);

        return dto;
    }

    // ============================================================
    // Private Builder Methods
    // ============================================================

    /**
     * 차량 요약 정보 빌드
     *
     * CarDetailRawDto → CarSummaryDtoV2 변환
     */
    private CarSummaryDtoV2 buildCarSummary(CarDetailRawDto raw) {
        CarSummaryDtoV2 dto = new CarSummaryDtoV2();

        dto.setSpecId(raw.getSpecId());
        dto.setTitle(raw.getModelName());
        dto.setSubtitle(buildSubtitle(raw));
        dto.setImageUrl(raw.getImgUrl()
        );
        return dto;
    }

    /**
     * 차량 subtitle 생성
     *
     * 형식: "연료타입 N인승" (예: "가솔린 5인승")
     */
    private String buildSubtitle(CarDetailRawDto raw) {
        String fuel = (raw.getFuelType() != null)
                ? raw.getFuelType().getDescription()
                : "";
        int seats = (raw.getSeatingCapacity() != null)
                ? raw.getSeatingCapacity()
                : 0;

        return String.format("%s %d인승", fuel, seats);
    }

    /**
     * 픽업 지점 정보 빌드
     *
     * BranchZoneDetailDto → PickupLocationDtoV2 변환
     */
    private PickupLocationDtoV2 buildPickupLocation(BranchZoneDetailDto branch) {
        PickupLocationDtoV2 dto = new PickupLocationDtoV2();
        dto.setPickType(PickupType.VISIT);  // 기본값: 방문
        dto.setBranchId(branch.getBranchId());
        dto.setBranchName(branch.getBranchName());
        dto.setAddress(branch.getAddressBasic());
        dto.setContact(branch.getPhone());
        dto.setLatitude(null);   // 지도 미사용
        dto.setLongitude(null);  // 지도 미사용
        return dto;
    }

    /**
     * 반납 지점 정보 빌드
     *
     * - 현재는 픽업 지점과 동일하게 설정
     * - 추후 returnBranchId 분리 시 별도 조회 필요
     */
    private ReturnLocationDtoV2 buildReturnLocation(BranchZoneDetailDto branch) {
        ReturnLocationDtoV2 dto = new ReturnLocationDtoV2();
        dto.setReturnType(ReturnTypes.VISIT);  // 기본값: 방문
        dto.setBranchId(branch.getBranchId());
        dto.setBranchName(branch.getBranchName());
        dto.setAddress(branch.getAddressBasic());
        dto.setContact(branch.getPhone());
        dto.setDropzoneId(null);  // VISIT이므로 null
        return dto;
    }

    /**
     * 보험 옵션 목록 빌드
     *
     * List<InsuranceRawDto> → List<InsuranceOptionDtoV2> 변환
     */
    private List<InsuranceOptionDtoV2> buildInsuranceOptions(List<InsuranceRawDto> rawList) {
        return rawList.stream()
                .map(raw -> {
                    InsuranceOptionDtoV2 dto = new InsuranceOptionDtoV2();
                    dto.setCode(raw.getInsuranceCode());
                    dto.setLabel(raw.getLabel());
                    dto.setSummaryLabel(raw.getSummaryLabel());
                    dto.setExtraDailyPrice(raw.getExtraDailyPrice().intValue());
                    dto.setDesc(getInsuranceDesc(raw.getInsuranceCode()));
                    dto.setDefault(raw.getIsDefault());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * 보험 코드 → 설명 변환
     *
     * InsuranceCode Enum의 description 활용
     */
    private String getInsuranceDesc(String code) {
        if (code == null || code.isBlank()) {
            return "";
        }
        try {
            return InsuranceCode.valueOf(code).getDescription();
        } catch (IllegalArgumentException e) {
            return "";
        }
    }

    /**
     * 결제 요약 정보 빌드
     *
     * PriceDisplayDTO + Period → PaymentSummaryDtoV2 변환
     * - PriceCalculatorService를 사용하여 시간 요금까지 정확히 계산
     */
    private PaymentSummaryDtoV2 buildPaymentSummary(PriceDisplayDTO priceDisplay, Period period) {
        PaymentSummaryDtoV2 dto = new PaymentSummaryDtoV2();

        // ========================================
        // 기본 정보 설정
        // ========================================
        dto.setRentType(priceDisplay.getRentType());
        dto.setPriceType(priceDisplay.getPriceType());
        dto.setUnitCount((int)period.getRentDaysForBilling());
        dto.setBaseUnitPrice(priceDisplay.getDisplayUnitPrice().intValue());

        // ========================================
        // 기본 금액 계산 (PriceCalculatorService 사용)
        // - 일수 + 시간 요금까지 정확히 계산
        // - 예: 25시간 → 1일 + 1시간 요금
        // ========================================
//        BigDecimal basePrice = priceCalculator.calculateTotalAmount(
//                priceDisplay.getDisplayUnitPrice(),
//                period.getRentDays(),
//                period.getRentRemainHours()
//        );
//        dto.setBasePrice(basePrice.intValue());

        // ========================================
        // 할인 정보 (폼 단계에서는 미적용)
        // ========================================
        dto.setDiscountTotalPrice(0);
        dto.setDiscountDesc(null);

        // ========================================
        // 보험 금액 (폼 초기: NONE 선택 상태)
        // - 보험 선택 시 recalculateWithInsurance()에서 재계산
        // ========================================
        dto.setInsuranceTotalPrice(0);

        // ========================================
        // 최종 금액
        // - PriceSummaryService에서 계산된 값 사용
        // ========================================
        dto.setFinalTotalPrice(priceDisplay.getEstimatedTotalAmount().intValue());
        dto.setCurrency("KRW");

        return dto;
    }
}
