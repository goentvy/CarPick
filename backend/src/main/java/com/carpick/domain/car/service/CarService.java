package com.carpick.domain.car.service;

import com.carpick.domain.car.dto.cardetailpage.*;
import com.carpick.domain.car.dto.common.BranchLocationDto;

import com.carpick.domain.car.dto.raw.CarDetailRawDto;
import com.carpick.domain.car.mapper.CarMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarMapper carMapper;



    //차량 상세정보 조회(DB연동)
    public CarDetailResponseDto getCarDetail(Long carId) {
        // 1. DB에서 Raw 데이터 조회
        CarDetailRawDto raw =carMapper.selectCarDetail(carId);
        if(raw == null){

            throw  new RuntimeException("차량 정보가 없습니다. carId = " + carId);

        }

//        1.top영역
        TopCarDetailDto top = new TopCarDetailDto();
        top.setTitle(raw.getModelName());
        top.setSubtitle(
                raw.getModelYearBase() + "년형 - "
                + raw.getSeatingCapacity() + "인승 - "
                + raw.getFuelType() + " " + raw.getCarClass()
        );
        top.setImageUrls(List.of(raw.getMainImageUrl()));
        top.setCarType(raw.getCarClass());
//2. 카드 영역
        // 카드 1 - 연료
        CarInfoCardDto fuel = new CarInfoCardDto();
        fuel.setType("FUEL");
        fuel.setTitle("연료");
        fuel.setValue(raw.getFuelType());
        fuel.setUnit(null);
        fuel.setIcon("fuel");
        //  카드 2 - 연식
        CarInfoCardDto year = new CarInfoCardDto();
        year.setType("YEAR");
        year.setTitle("연식");
        year.setValue(String.valueOf(raw.getModelYearBase()));
        year.setUnit("년");
        year.setIcon("year");
//  카드 3 - 좌석
        CarInfoCardDto seat = new CarInfoCardDto();
        seat.setType("SEATS");
        seat.setTitle("승차 인원");
        seat.setValue(String.valueOf(raw.getSeatingCapacity()));
        seat.setUnit("명");
        seat.setIcon("seats");
        //  카드 4 - 경력
        CarInfoCardDto career = new CarInfoCardDto();
        career.setType("CAREER");
        career.setTitle("운전 경력");
        career.setValue(String.valueOf(raw.getMinLicenseYears()));
        career.setUnit("년 이상");
        career.setIcon("career");
//  카드 5 - 나이
        CarInfoCardDto age = new CarInfoCardDto();
        age.setType("AGE");
        age.setTitle("이용 가능 연령");
        age.setValue(String.valueOf(raw.getMinDriverAge()));
        age.setUnit("세 이상");
        age.setIcon("age");
        //  카드 6 - 연비
        CarInfoCardDto fuelEff = new CarInfoCardDto();
        fuelEff.setType("FUEL_EFF");
        fuelEff.setTitle("연비");
        fuelEff.setValue(String.valueOf(raw.getFuelEfficiency()));
        fuelEff.setUnit("km/L");
        fuelEff.setIcon("fuel_eff");
// 4) carCardSectionDto로 묶기
        CarCardSectionDto carCardSectionDto = new CarCardSectionDto();
        carCardSectionDto.setCards(List.of(fuel, year, seat, career, age, fuelEff));

        // 10. 위치
        BranchLocationDto pickup = new BranchLocationDto();
        pickup.setBranchId(raw.getBranchId());
        pickup.setBranchName(raw.getBranchName());
        pickup.setAddress(raw.getAddressBasic());
        pickup.setLatitude(raw.getLatitude());
        pickup.setLongitude(raw.getLongitude());
        // openHours 조합 (null 체크)
        String openHours = (raw.getOpenTime() != null && raw.getCloseTime() != null)
                ? raw.getOpenTime() + " ~ " + raw.getCloseTime()
                : "08:00 ~ 20:00";  // 기본값

        BranchLocationDto dropoff = pickup; // 동일 지점

        LocationDto location = new LocationDto();
        location.setPickup(pickup);
        location.setDropoff(dropoff);
//11.가격
        // DB 값이 없으면 기본값 0 처리 (Null Safe)
        BigDecimal dailyPrice = raw.getDailyPrice() != null ? raw.getDailyPrice() : BigDecimal.ZERO;
        Integer discountRate = raw.getDiscountRate() != null ? raw.getDiscountRate() : 0;

        // 할인 적용 가격 계산 로직 (원가 * (100 - 할인율)%)
        BigDecimal discountMultiplier = BigDecimal.valueOf(100 - discountRate).divide(BigDecimal.valueOf(100));
        BigDecimal finalPrice = dailyPrice.multiply(discountMultiplier);

        PriceSummaryDto price = new PriceSummaryDto();

        // ★ [핵심] 여기에 값을 넣어줘야 JSON에 나옵니다! ★
        price.setOriginalPrice(dailyPrice);       // 17000 (원가)
        price.setDiscountRate(discountRate);      // 5 (할인율)
        price.setDailyPrice(finalPrice); // 16150 (계산된 최종가)
        price.setCurrency("KRW");


//        최종응답
        CarDetailResponseDto response = new CarDetailResponseDto();
        response.setCarId(carId);
        response.setTopCarDetailDto(top);
        response.setCarCardSectionDto(carCardSectionDto);
        response.setLocationDto(location);
        response.setPriceSummary(price);
        return response;


    }

}



