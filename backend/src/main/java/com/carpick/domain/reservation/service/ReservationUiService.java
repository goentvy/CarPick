package com.carpick.domain.reservation.service;

import com.carpick.domain.car.dto.cardetailpage.CarDetailResponseDto;
import com.carpick.domain.car.service.CarService;
import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import com.carpick.domain.insurance.enums.InsuranceCode;
import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.dto.request.ReservationPriceRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationCreateResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationFormResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationUiService {
    private final CarService carService;
    private final ReservationMapper reservationMapper;
    private final ReservationPriceService priceService;
    private final ReservationCommandService commandService;
    /**
     * 예약 페이지 초기 로딩 데이터
     */
    public ReservationFormResponseDto getForm(Long carId) {
        // 1. 차량 상세 조회 (기존 로직 유지)
        CarDetailResponseDto detail = carService.getCarDetail(carId);

        int dailyPrice = detail.getPriceSummary()
                .getDailyPrice()
                .intValue();

        ReservationFormResponseDto res = new ReservationFormResponseDto();
        // ===== 차량 정보 =====
        ReservationFormResponseDto.CarSummaryDto car = new ReservationFormResponseDto.CarSummaryDto();
        car.setCarId(detail.getCarId());
        car.setTitle(detail.getTopCarDetailDto().getTitle());
        car.setSubtitle(detail.getTopCarDetailDto().getSubtitle());
        car.setImageUrl(detail.getTopCarDetailDto().getImageUrls().get(0));
        car.setDailyPrice(dailyPrice);
        car.setCurrency("KRW");
        res.setCar(car);

        // ===== 지점 정보 (pickup / dropoff기준) =====
        var pickupSrc = detail.getLocationDto().getPickup();
        var dropoffSrc = (detail.getLocationDto().getDropoff() != null)
                ? detail.getLocationDto().getDropoff()
                : pickupSrc;
        //    pickup
        ReservationFormResponseDto.BranchSummaryDto pickup = new ReservationFormResponseDto.BranchSummaryDto();
        pickup.setBranchId(pickupSrc.getBranchId());
        pickup.setBranchName(pickupSrc.getBranchName());
        pickup.setAddress(pickupSrc.getAddress());
        pickup.setOpenHours("08:00 ~ 20:00");
        res.setPickupBranch(pickup);

       //        dropoff
        ReservationFormResponseDto.BranchSummaryDto dropoff = new ReservationFormResponseDto.BranchSummaryDto();
        dropoff.setBranchId(dropoffSrc.getBranchId());
        dropoff.setBranchName(dropoffSrc.getBranchName());
        dropoff.setAddress(dropoffSrc.getAddress());
        dropoff.setOpenHours("08:00 ~ 20:00");
        res.setDropoffBranch(dropoff);
        // ===== 차량 뱃지(상단 아이콘 줄) =====
        // 지금은 mock로 고정 (추후 detail 카드섹션에서 추출해도 됨)
//        res.setBadges(List.of(
//                badge("car", "자동차"),
//                badge("insurance", "보험"),
//                badge("location", "지역"),
//                badge("payment", "결제")
//
//        ));
        // ===== 보험 옵션 (DB 조회)=====
        List<InsuranceRawDto> insuranceList = reservationMapper.selectInsuranceOptions();
        List<ReservationFormResponseDto.InsuranceOptionDto> insuranceOptions = insuranceList.stream()
                .map(raw ->{
                    ReservationFormResponseDto.InsuranceOptionDto dto = new ReservationFormResponseDto.InsuranceOptionDto();
                    dto.setCode(raw.getInsuranceCode());
                    dto.setLabel(raw.getLabel());
                    dto.setSummaryLabel(raw.getSummaryLabel());
                    dto.setExtraDailyPrice(raw.getExtraDailyPrice().intValue());
                    dto.setDefault(raw.getIsDefault());
                    dto.setDesc(getInsuranceDesc(raw.getInsuranceCode()));
                    return dto;





                })
                .collect(Collectors.toList());

        res.setInsuranceOptions(insuranceOptions);
        // ===== 기본 결제 요약 (보험 NONE 기준) =====
        ReservationFormResponseDto.PaymentSummaryDto ps = new ReservationFormResponseDto.PaymentSummaryDto();
        ps.setCarDailyPrice(dailyPrice);
        ps.setInsuranceDailyPrice(0);
        ps.setTotalPrice(dailyPrice);
        ps.setCurrency(detail.getPriceSummary().getCurrency());
        res.setPaymentSummary(ps);
        return res;



    }
    /**
     * 보험 선택 시 가격 재계산 (백엔드에서 합산)
     */
    public ReservationPriceResponseDto calcPrice(Long carId, ReservationPriceRequestDto req){
    CarDetailResponseDto detail =carService.getCarDetail(carId);
        // ✅ 동일 스타일로 가격 추출
        int carDailyPrice = detail.getPriceSummary()
                .getDailyPrice()
                .intValue();
        String code = (req == null || req.getInsuranceCode() == null) ? "NONE" : req.getInsuranceCode();
        // DB에서 보험 가격 조회
        InsuranceRawDto insurance = reservationMapper.selectInsuranceByCode(code);
        int insuranceDailyPrice = (insurance != null)
                ? insurance.getExtraDailyPrice().intValue()
                : 0;

        return  new ReservationPriceResponseDto(
                carDailyPrice,
                insuranceDailyPrice,
                carDailyPrice + insuranceDailyPrice

        );



    }
    /**
     * 예약 생성 (진짜 저장) - Command로 위임
     */
    public ReservationCreateResponseDto create(ReservationCreateRequestDto req) {
        Long userId = 1L; // TODO: 로그인 붙으면 세션/토큰에서
        return commandService.createReservation(req, userId);
    }





    // ====== 내부 유틸 ======

    /**
     * 보험 코드 → 설명 변환 (InsuranceCode enum 활용)
     */
    private String getInsuranceDesc(String code) {
        if (code == null || code.isBlank()) {
            return ""; // 또는 "보험 선택 안함"
        }

        try {
            return InsuranceCode.valueOf(code).getDescription();
        } catch (IllegalArgumentException e) {
            return "";
        }
    }



//    private ReservationFormResponseDto.CarBadgeDto badge(String icon, String text) {
//        ReservationFormResponseDto.CarBadgeDto badge = new ReservationFormResponseDto.CarBadgeDto();
//        badge.setIcon(icon);
//        badge.setText(text);
//        return badge;
//
//    }

}
