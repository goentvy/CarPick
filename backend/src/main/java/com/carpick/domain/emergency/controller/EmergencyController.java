package com.carpick.domain.emergency.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.emergency.dto.EmergencyDto;
import com.carpick.domain.emergency.service.EmergencyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService service;

    @GetMapping
    public List<EmergencyDto> getServices() {
        return service.getEmergencyServices();
    }
}
