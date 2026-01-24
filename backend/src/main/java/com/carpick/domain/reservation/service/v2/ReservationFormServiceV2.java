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
import com.carpick.domain.price.dto.ReservationPriceSummaryRequestDto;
import com.carpick.domain.price.dto.ReservationPriceSummaryResponseDto;
import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.price.reservation.ReservationPriceSummaryService;
import com.carpick.domain.reservation.dtoV2.request.ReservationFormRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationFormResponseDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationFormResponseDtoV2.*;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.RentType;
import com.carpick.domain.reservation.enums.ReturnTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
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
    // 의존성
    // ============================================================
    private final CarMapper carMapper;
    private final BranchMapper branchMapper;
    private final InsuranceMapper insuranceMapper;

    //  “스냅샷 저장 가능한 진짜 견적” 서비스
    private final ReservationPriceSummaryService reservationPriceSummaryService;

    // ============================================================
    // Public
    // ============================================================

    /**
     * [메인] 예약 폼 화면 데이터 조회
     */
    public ReservationFormResponseDtoV2 getReservationForm(ReservationFormRequestDtoV2 request) {

        validateFormRequest(request);

        // 1) 차량 정보
        CarDetailRawDto carDetail = carMapper.selectCarDetailV2(
                request.getSpecId(),
                request.getPickupBranchId()
        );
        if (carDetail == null) {
            throw new IllegalArgumentException("차량 정보를 찾을 수 없습니다. specId=" + request.getSpecId());
        }
        CarSummaryDtoV2 carSummary = buildCarSummary(carDetail);

        // 2) 픽업 지점 정보
        BranchZoneDetailDto pickupBranch = branchMapper.findForZoneDetail(request.getPickupBranchId());
        if (pickupBranch == null) {
            throw new IllegalArgumentException("픽업 지점을 찾을 수 없습니다. branchId=" + request.getPickupBranchId());
        }
        PickupLocationDtoV2 pickupLocation = buildPickupLocation(pickupBranch);

        // 3) 반납 지점 (현재는 픽업=반납)
        ReturnLocationDtoV2 returnLocation = buildReturnLocation(pickupBranch);

        // 4) 보험 옵션
        List<InsuranceRawDto> insuranceRawList = insuranceMapper.selectInsuranceOptionsV2();
        List<InsuranceOptionDtoV2> insuranceOptions = buildInsuranceOptions(insuranceRawList);

        // 5) 결제 요약(견적) - 초기 보험 NONE
        Period period = Period.of(request.getStartAt(), request.getEndAt());

        ReservationPriceSummaryResponseDto priceRes = reservationPriceSummaryService.calculate(
                toPriceSummaryRequest(request, InsuranceCode.NONE)
        );

        PaymentSummaryDtoV2 paymentSummary = buildPaymentSummary(
                priceRes,
                safeRentType(request.getRentType()),
                request.getMonths(),
                period
        );
        RentType rentType = safeRentType(request.getRentType());
        // 6) 응답
        return ReservationFormResponseDtoV2.builder()
                .rentType(rentType)
                .car(carSummary)
                .insuranceOptions(insuranceOptions)
                .paymentSummary(paymentSummary)
                .pickupLocation(pickupLocation)
                .returnLocation(returnLocation)
                .startDateTime(request.getStartAt().toString())
                .endDateTime(request.getEndAt().toString())
                .rentalDays((rentType == RentType.SHORT) ? (int) period.getRentDaysForBilling() : null)
                .rentalMonths((rentType == RentType.LONG) ? request.getMonths() : null)
                .build();

    }


    /**
     * [보험 변경] 보험 선택 시 가격 재계산
     */
    // NOTE: 현재 프런트에서는 LONG 보험 UI를 숨겨서 본 메서드를 호출하지 않을 수 있음.
//       단기 보험 선택(또는 향후 UI 복구) 시 재사용 예정이며, LONG 과금 방지 안전장치 포함.

    public PaymentSummaryDtoV2 recalculateWithInsurance(
            ReservationFormRequestDtoV2 request,
            String insuranceCode
    ) {
        validateFormRequest(request);

        RentType rentType = safeRentType(request.getRentType());
        Period period = Period.of(request.getStartAt(), request.getEndAt());

        //  [추가된 안전장치] 장기 렌트는 무조건 NONE으로 고정
        // 사용자가 API로 "FULL"을 보내도 무시하고 "NONE"으로 처리함
        InsuranceCode codeEnum;
        if (rentType == RentType.LONG) {
            codeEnum = InsuranceCode.NONE;
        } else {
            codeEnum = parseInsuranceCode(insuranceCode);
        }

        ReservationPriceSummaryResponseDto priceRes = reservationPriceSummaryService.calculate(
                toPriceSummaryRequest(request, codeEnum)
        );

        return buildPaymentSummary(priceRes, rentType, request.getMonths(), period);
    }

    // ============================================================
    // Private - Validation / Mapping
    // ============================================================

    private void validateFormRequest(ReservationFormRequestDtoV2 request) {
        if (request == null) {
            throw new IllegalArgumentException("request가 비어있습니다.");
        }
        if (request.getSpecId() == null) {
            throw new IllegalArgumentException("specId가 비어있습니다.");
        }
        if (request.getPickupBranchId() == null) {
            throw new IllegalArgumentException("pickupBranchId가 비어있습니다.");
        }
        if (request.getStartAt() == null || request.getEndAt() == null) {
            throw new IllegalArgumentException("startDateTime/endDateTime이 비어있습니다.");
        }

        RentType rentType = safeRentType(request.getRentType());
        if (rentType == RentType.LONG) {
            if (request.getMonths() == null || request.getMonths() <= 0) {
                throw new IllegalArgumentException("장기 렌트는 months가 1 이상이어야 합니다. months=" + request.getMonths());
            }
        }
        // driverInfo는 "폼 입력 검증용"이므로 여기서는 강제 검증하지 않음 (프론트/컨트롤러에서 필요 시)
    }

    private RentType safeRentType(RentType rentType) {
        return (rentType == null) ? RentType.SHORT : rentType;
    }

    private InsuranceCode parseInsuranceCode(String insuranceCode) {
        if (insuranceCode == null || insuranceCode.isBlank()) {
            return InsuranceCode.NONE;
        }
        try {
            return InsuranceCode.valueOf(insuranceCode);
        } catch (IllegalArgumentException e) {
            return InsuranceCode.NONE;
        }
    }

    /**
     * 폼 요청 -> 견적 요청으로 변환
     */
    private ReservationPriceSummaryRequestDto toPriceSummaryRequest(ReservationFormRequestDtoV2 request,
                                                                    InsuranceCode insuranceCode) {

        RentType rentType = safeRentType(request.getRentType());

        ReservationPriceSummaryRequestDto dto = new ReservationPriceSummaryRequestDto();
        dto.setSpecId(request.getSpecId());
        dto.setRentType(rentType);

        // 가격 서비스 정책상 SHORT/LONG 모두 start/end 필요 (보험 MVP 재사용)
        dto.setStartDateTime(request.getStartAt());
        dto.setEndDateTime(request.getEndAt());

        // LONG만 months 세팅
        dto.setMonths(rentType == RentType.LONG ? request.getMonths() : null);

        dto.setInsuranceCode((insuranceCode == null) ? InsuranceCode.NONE : insuranceCode);

        // 폼 단계에서는 쿠폰 미적용(필요 시 request에 couponCode 추가 후 연결)
        dto.setCouponCode(null);

        return dto;
    }

    // ============================================================
    // Private - PaymentSummary Builder
    // ============================================================

    private PaymentSummaryDtoV2 buildPaymentSummary(ReservationPriceSummaryResponseDto priceRes,
                                                    RentType rentType,
                                                    Integer months,
                                                    Period period) {

        int rentFee = nvl(priceRes.getRentFee());
        int insuranceFee = nvl(priceRes.getInsuranceFee());
        int couponDiscount = nvl(priceRes.getCouponDiscount());
        int totalAmount = nvl(priceRes.getTotalAmount());

        int unitCount = (rentType == RentType.LONG)
                ? ((months == null) ? 0 : months)
                : (int) period.getRentDaysForBilling();

        // 단가가 “정확히” 필요하면 priceRes에 unitPrice를 포함시키는 게 정답입니다.
        // 지금은 표시용으로만 추정(0 방지).
        int baseUnitPrice = (unitCount > 0) ? (rentFee / unitCount) : 0;

        return PaymentSummaryDtoV2.builder()
                .rentType(rentType)
                .priceType(rentType == RentType.LONG ? PriceType.MONTHLY : PriceType.DAILY)
                .unitCount(unitCount)
                .baseUnitPrice(baseUnitPrice)
                .basePrice(rentFee)
                .discountTotalPrice(couponDiscount)
                .discountDesc(couponDiscount > 0 ? "쿠폰 할인" : null)
                .insuranceTotalPrice(insuranceFee)
                .finalTotalPrice(totalAmount)
                .currency("KRW")
                .build();
    }

    private int nvl(BigDecimal v) {
        return (v == null) ? 0 : v.intValue();
    }

    // ============================================================
    // Private - 차량/지점/보험 Builder
    // ============================================================

    private CarSummaryDtoV2 buildCarSummary(CarDetailRawDto raw) {
        CarSummaryDtoV2 dto = new CarSummaryDtoV2();
        dto.setSpecId(raw.getSpecId());
        dto.setTitle(raw.getModelName());
        dto.setSubtitle(buildSubtitle(raw));
        dto.setImageUrl(raw.getImgUrl());
        return dto;
    }

    private String buildSubtitle(CarDetailRawDto raw) {
        String fuel = (raw.getFuelType() != null)
                ? raw.getFuelType().getDescription()
                : "";
        int seats = (raw.getSeatingCapacity() != null)
                ? raw.getSeatingCapacity()
                : 0;
        return String.format("%s %d인승", fuel, seats);
    }

    private PickupLocationDtoV2 buildPickupLocation(BranchZoneDetailDto branch) {
        PickupLocationDtoV2 dto = new PickupLocationDtoV2();
        dto.setPickType(PickupType.VISIT);
        dto.setBranchId(branch.getBranchId());
        dto.setBranchName(branch.getBranchName());
        dto.setAddress(branch.getAddressBasic());
        dto.setContact(branch.getPhone());
        dto.setLatitude(null);
        dto.setLongitude(null);
        return dto;
    }

    private ReturnLocationDtoV2 buildReturnLocation(BranchZoneDetailDto branch) {
        ReturnLocationDtoV2 dto = new ReturnLocationDtoV2();
        dto.setReturnType(ReturnTypes.VISIT);
        dto.setBranchId(branch.getBranchId());
        dto.setBranchName(branch.getBranchName());
        dto.setAddress(branch.getAddressBasic());
        dto.setContact(branch.getPhone());
        dto.setDropzoneId(null);
        return dto;
    }

    private List<InsuranceOptionDtoV2> buildInsuranceOptions(List<InsuranceRawDto> rawList) {
        return rawList.stream()
                .map(raw -> {
                    InsuranceOptionDtoV2 dto = new InsuranceOptionDtoV2();
                    dto.setCode(parseInsuranceCode(raw.getInsuranceCode()));  // 기존 메서드 재사용
                    dto.setLabel(raw.getLabel());
                    dto.setSummaryLabel(raw.getSummaryLabel());
                    dto.setExtraDailyPrice(raw.getExtraDailyPrice().intValue());
                    dto.setDesc(raw.getInsuranceCode() != null
                            ? parseInsuranceCode(raw.getInsuranceCode()).getDescription()
                            : "");
                    dto.setDefault(raw.getIsDefault());
                    return dto;
                })
                .collect(Collectors.toList());
    }

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
}
