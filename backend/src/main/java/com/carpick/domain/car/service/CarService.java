package com.carpick.domain.car.service;

import com.carpick.domain.car.dto.CarDetailDto;
import com.carpick.domain.car.dto.CarListDto;
import com.carpick.domain.car.dto.response.CarListResponseDto;
import com.carpick.domain.car.dto.response.cardetailpage.*;
import com.carpick.domain.car.dto.response.common.BranchLocationDto;
import com.carpick.domain.car.mapper.CarMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarMapper carMapper;

    public List<CarDetailDto> getCarList() {
        return carMapper.getCarList();
    }
    // 상세페이지 가데이터(이 형식대로감)
    public CarDetailResponseDto getCarDetailMock(Long carId){
//        1.top영역
TopCarDetailDto top = new TopCarDetailDto();
top.setTitle("더 뉴 쏘렌토 4세대 (MQ4) HEV 1.6 2WD 그래비티");
top.setSubtitle("2024년형 · 5인승 · 하이브리드 SUV");
top.setImageUrls(List.of("https://cdn.carpick/cars/sorento-360.webp"));
//2. 카드 영역
        // 카드 1 - 연료
        CarInfoCardDto fuel = new CarInfoCardDto();
        fuel.setType("FUEL");
        fuel.setTitle("연료");
        fuel.setValue("HYBRID");
        fuel.setUnit(null);
        fuel.setIcon("fuel");
        //  카드 2 - 연식
CarInfoCardDto year = new CarInfoCardDto();
year.setType("YEAR");
year.setTitle("연식");
year.setValue("23~24");
year.setUnit("년");
year.setIcon("year");
//  카드 3 - 좌석
        CarInfoCardDto seat = new CarInfoCardDto();
        seat.setType("SEATS");
        seat.setTitle("승차 인원");
        seat.setValue("4");
        seat.setUnit("명");
        seat.setIcon("seats");
        //  카드 4 - 경력
        CarInfoCardDto career = new CarInfoCardDto();
        career.setType("CAREER");
        career.setTitle("운전 경력");
        career.setValue("1");
        career.setUnit("년 이상");
        career.setIcon("career");
//  카드 5 - 나이
        CarInfoCardDto age = new CarInfoCardDto();
        age.setType("AGE");
        age.setTitle("이용 가능 연령");
        age.setValue("21");
        age.setUnit("세 이상");
        age.setIcon("age");
        //  카드 6 - 연비
        CarInfoCardDto fuelEff = new CarInfoCardDto();
        fuelEff.setType("FUEL_EFF");
        fuelEff.setTitle("연비");
        fuelEff.setValue("15");
        fuelEff.setUnit("km/L");
        fuelEff.setIcon("fuel_eff");
        // 7. 카드 섹션 공지
        CarInfoNotice notice = new CarInfoNotice();
        notice.setTitle("주행 거리 요금제 안내");
        notice.setContent("주행거리에 따라 요금이 산정되며, 주행거리 요금 외 주유비 또는 충전료는 발생하지 않아요.");
//        8. 카드 섹션
        CarCardSectionDto cardSection = new CarCardSectionDto();
        cardSection.setCards(List.of(fuel, year, seat, career, age, fuelEff));
        cardSection.setNotice(notice);
//        9.살균
        SanitizationDto sanitization = new SanitizationDto();
        sanitization.setTitle("99.9% 살균 세차");
        sanitization.setContent("최신 기술로 99.9% 살균 세차를 제공해요.");
        sanitization.setImageUrls(List.of("https://cdn.carpick/sanitize/1.jpg",
                "https://cdn.carpick/sanitize/2.jpg"));
        // 10. 위치
        BranchLocationDto pickup = new BranchLocationDto();
        pickup.setBranchId(10L);
        pickup.setBranchName("연세IT미래교육원 수원역캠퍼스");
        pickup.setAddress("경기 수원시 팔달구 덕영대로 909");
        pickup.setLatitude(BigDecimal.valueOf(37.2666538));
        pickup.setLongitude(BigDecimal.valueOf(127.0003127));

        BranchLocationDto dropoff = pickup;

        LocationDto location = new LocationDto();
        location.setPickup(pickup);
        location.setDropoff(dropoff);
//        최종응답
        CarDetailResponseDto response = new CarDetailResponseDto();
        response.setCarId(carId);
        response.setTopCarDetailDto(top);
        response.setCarCardSectionDto(cardSection);
        response.setSanitizationDto(sanitization);
        response.setLocationDto(location);
        return response;


    }

}



