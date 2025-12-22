package com.carpick.domain.guide.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.guide.dto.GuideDto;
import com.carpick.domain.guide.service.GuideService;

@RestController
@RequestMapping("/guide")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    public List<GuideDto> getGuide() {
        return guideService.getGuide();
    }
}

