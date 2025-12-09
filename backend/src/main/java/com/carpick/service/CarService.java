package com.carpick.service;

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
}
