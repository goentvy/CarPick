package com.carpick.domain.car.controller;


import com.carpick.domain.car.dto.carListPage.CarListItemDto;
import com.carpick.domain.car.dto.cardetailpage.CarDetailResponseDto;
import com.carpick.domain.car.service.CarListService;
import com.carpick.domain.car.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;
  private  final   CarListService carListService;
//차량상세 (DB 연동)
    @GetMapping("/{carId}")
    private ResponseEntity<CarDetailResponseDto> getCarDetail(@PathVariable Long carId){
        CarDetailResponseDto carDetailResponseDto = carService.getCarDetail(carId);
        return ResponseEntity.ok(carDetailResponseDto);
    }

    // 차량 목록 페이지  (차종 카드)
    @GetMapping
    public ResponseEntity<List<CarListItemDto>> getCarList() {
        return ResponseEntity.ok(carListService.getCarListItems());
    }
    }



