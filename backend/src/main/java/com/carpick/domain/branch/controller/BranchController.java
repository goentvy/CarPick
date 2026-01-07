package com.carpick.domain.branch.controller;

import com.carpick.domain.branch.dto.BranchHomeDto;
import com.carpick.domain.branch.dto.BranchZoneDetailDto;
import com.carpick.domain.branch.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * BranchController
 * - 홈/검색모달: GET /api/branches
 * - 카픽존 상세보기: GET /api/branches/{branchId}
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    /** 홈/검색모달 리스트 */
    @GetMapping
    public List<BranchHomeDto> list() {
        return branchService.getBranchesForHome();
    }

    /** 카픽존 상세보기(1건) */
    @GetMapping("/{branchId}")
    public BranchZoneDetailDto detail(@PathVariable long branchId) {
        return branchService.getBranchForZone(branchId);
    }
}
