package com.carpick.domain.branch.service;

import com.carpick.domain.branch.dto.BranchHomeDto;
import com.carpick.domain.branch.dto.BranchZoneDetailDto;
import com.carpick.domain.branch.mapper.BranchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * BranchService
 * - 홈/검색모달 리스트
 * - 카픽존 상세보기(1건)
 */
@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchMapper branchMapper;

    /** 홈/검색모달용 */
    public List<BranchHomeDto> getBranchesForHome() {
        return branchMapper.findForHome();
    }

    /** 카픽존 상세보기용 */
    public BranchZoneDetailDto getBranchForZone(long branchId) {
        BranchZoneDetailDto dto = branchMapper.findForZoneDetail(branchId);
        if (dto == null) {
            // 주석: MVP에서도 null 그대로 내려주면 프론트가 더 힘듦 → 명확히 에러
            throw new IllegalArgumentException("Branch not found: " + branchId);
        }
        return dto;
    }
}