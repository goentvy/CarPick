package com.carpick.domain.zone.controller;

import com.carpick.domain.zone.service.ZoneMapService;
import com.carpick.domain.zone.dto.ZoneMapDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * ✅ ZoneController
 * - 지도에서 필요한 집합 데이터(브랜치 + 드롭존) 제공
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/zone")
public class ZoneController {

    private final ZoneMapService zoneMapService;

    /**
     * ✅ GET /api/zone/map
     * - 브랜치 + 드롭존 포인트를 한 번에 내려줌
     */
    @GetMapping("/map")
    public ZoneMapDto map() {
        return zoneMapService.getZoneMap();
    }
}

