package com.carpick.domain.car.controller;


import com.carpick.domain.car.dto.response.CarListResponseDto;
import com.carpick.domain.car.dto.response.cardetailpage.CarDetailResponseDto;
import com.carpick.domain.car.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class VehicleController {
    private final CarService carService;
//차량상세 (가데이터)
    @GetMapping("/{carId}")
    private CarDetailResponseDto getCarDetailMock(@PathVariable Long carId){
        return carService.getCarDetailMock(carId);

    }


}
