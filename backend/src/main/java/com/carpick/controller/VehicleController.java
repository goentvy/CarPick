package com.carpick.controller;


import com.carpick.dto.response.CarListResponseDto;
import com.carpick.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class VehicleController {
    private final CarService carService;
    // 차량 목록 조회
    @GetMapping
    private ResponseEntity<CarListResponseDto> getAllCars(){
        CarListResponseDto response = carService.getAllCars();
        return ResponseEntity.ok(response);


    }



}
