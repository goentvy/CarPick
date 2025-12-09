package com.carpick.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.carpick.service.CarService;

@Controller
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping("/cars")
    public String carList(Model model) {
        model.addAttribute("cars", carService.getCarList());
        return "carList"; // → carList.html 이동
    }
}
