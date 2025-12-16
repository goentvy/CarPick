package com.carpick.service;

import com.carpick.dto.CarListDto;
import com.carpick.dto.response.CarListResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.carpick.mapper.CarMapper;
import com.carpick.model.Car;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarMapper carMapper;

    public List<Car> getCarList() {
        return carMapper.getCarList();
    }


//    하드코딩(테스트용)
    public CarListResponseDto getAllCars(){
        CarListDto car = new CarListDto();
        car.setVehicleId(1L);
        car.setBrand("기아");
        car.setModelName("더 뉴 쏘렌토");
        car.setCarClass("SUV");
        car.setFuelType("가솔린");
        car.setSeatingCapacity(5);
        car.setMainImageUrl("https://cdn.carpick/cars/sorento.png");
        car.setStandardPrice(128000);
        car.setBranchName("김포공항점");
        car.setStatus("AVAILABLE");
CarListResponseDto response = new CarListResponseDto();
        response.setCars(List.of(car));
        return response;




    }


}
