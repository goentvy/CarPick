package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.CarMapper;
import com.example.demo.model.Car;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarMapper carMapper;

    public List<Car> getCarList() {
        return carMapper.getCarList();
    }
}
