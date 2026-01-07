package com.carpick.domain.branch.controller;

import com.carpick.domain.branch.dto.DropzoneDetailDto;
import com.carpick.domain.branch.dto.DropzoneStatusDto;
import com.carpick.domain.branch.service.DropzoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ✅ 라우팅만 담당 (로직 없음)
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dropzones")
public class DropzoneController {

    private final DropzoneService dropzoneService;

    @GetMapping
    public List<DropzoneDetailDto> list(@RequestParam long branchId) {
        return dropzoneService.getDropzones(branchId);
    }

    @GetMapping("/{dropzoneId}/status")
    public DropzoneStatusDto status(@PathVariable long dropzoneId) {
        return dropzoneService.getStatus(dropzoneId);
    }
}