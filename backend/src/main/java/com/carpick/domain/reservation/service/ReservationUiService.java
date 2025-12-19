package com.carpick.domain.reservation.service;

import com.carpick.domain.car.dto.response.cardetailpage.CarDetailResponseDto;
import com.carpick.domain.car.service.CarService;
import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.dto.request.ReservationPriceRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationCreateResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationFormResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationUiService {
    public  final CarService carService;
    /**
     * 예약 페이지 초기 로딩 데이터
     */
    public ReservationFormResponseDto getForm(Long carId) {
        // ✅ 어제 만든 상세 mock 그대로 재사용
        CarDetailResponseDto detail = carService.getCarDetailMock(carId);
        // ✅ 128,000원을 1일 가격으로 사용
        int dailyPrice = detail.getPriceSummary()
                .getEstimatedTotalPrice()
                .intValue();

        ReservationFormResponseDto res = new ReservationFormResponseDto();
        // ===== 차량 정보 =====
        ReservationFormResponseDto.CarSummaryDto car = new ReservationFormResponseDto.CarSummaryDto();
        car.setCarId(detail.getCarId());
        car.setTitle(detail.getTopCarDetailDto().getTitle());
        car.setSubtitle(detail.getTopCarDetailDto().getSubtitle());
        car.setImageUrl(detail.getTopCarDetailDto().getImageUrls().get(0));
        car.setDailyPrice(dailyPrice);
        car.setCurrency(detail.getPriceSummary().getCurrency()); // KRW
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
        res.setBadges(List.of(
                badge("car", "자동차"),
                badge("insurance", "보험"),
                badge("location", "지역"),
                badge("payment", "결제")

        ));
        // ===== 보험 옵션 =====
        res.setInsuranceOptions(List.of(
                insurance("NONE", "선택안함", "선택안함", "사고 시 고객부담금 전액", 0, true),
                insurance("NORMAL", "일반자차", "일반면책", "사고 시 고객부담금 30만원", 10000, false),
                insurance("FULL", "완전자차", "완전자차", "사고 시 고객부담금 면제", 12000, false)
        ));
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
    CarDetailResponseDto detail =carService.getCarDetailMock(carId);
        // ✅ 동일 스타일로 가격 추출
        int carDailyPrice = detail.getPriceSummary()
                .getEstimatedTotalPrice()
                .intValue();
        String code = (req == null || req.getInsuranceCode() == null) ? "NONE" : req.getInsuranceCode();
        int insuranceDailyPrice = switch (code) {
            case "NORMAL" -> 10000;
            case "FULL" -> 12000;
            default -> 0;
        };

        return  new ReservationPriceResponseDto(
                carDailyPrice,
                insuranceDailyPrice,
                carDailyPrice + insuranceDailyPrice

        );



    }
//    createDemo -> 가짜 확정

    public ReservationCreateResponseDto createDemo(ReservationCreateRequestDto req){
        // 1️⃣ 차량 가격 다시 계산 (프론트 절대 신뢰 ❌)
        CarDetailResponseDto detail = carService.getCarDetailMock(req.getCarId());
        int carDailyPrice = detail.getPriceSummary()
                .getEstimatedTotalPrice()
                .intValue();
        // 2️⃣ 보험 가격 다시 계산 (프론트 절대 신뢰 ❌)
        String code =(req.getInsuranceCode() == null) ? "NONE" : req.getInsuranceCode();
        int insuranceDailyPrice = switch (code) {
            case "NORMAL" -> 10000;
            case "FULL" -> 12000;
            default -> 0;
        };
        int totalPrice = carDailyPrice + insuranceDailyPrice;
        // 3️⃣ 임시 예약번호 생성 (데모용)
        String reservationNo = "R-" + System.currentTimeMillis();
        // 4️⃣ 응답 생성
        return  new ReservationCreateResponseDto(
                reservationNo,
                req.getCarId(),
                code,
                carDailyPrice,
                insuranceDailyPrice,
                totalPrice,
                "예약이 완료 되었습니다(데모).");

    }



    // ====== 내부 유틸 ======
    private ReservationFormResponseDto.InsuranceOptionDto insurance(
            String code,
            String label,
            String summaryLabel,
            String desc,
            int price,
            boolean isDefault) {
        ReservationFormResponseDto.InsuranceOptionDto optionDto = new ReservationFormResponseDto.InsuranceOptionDto();
        optionDto.setCode(code);
        optionDto.setLabel(label);
        optionDto.setSummaryLabel(summaryLabel);
        optionDto.setDesc(desc);
        optionDto.setExtraDailyPrice(price);
        optionDto.setDefault(isDefault);
        return optionDto;


    }



    private ReservationFormResponseDto.CarBadgeDto badge(String icon, String text) {
        ReservationFormResponseDto.CarBadgeDto badge = new ReservationFormResponseDto.CarBadgeDto();
        badge.setIcon(icon);
        badge.setText(text);
        return badge;

    }

}
