package com.carpick.domain.branch.service;

import com.carpick.domain.branch.dto.BranchHomeDto;
import com.carpick.domain.branch.dto.BranchZoneDetailDto;
import com.carpick.domain.branch.mapper.BranchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * BranchService
 * - 홈/검색 리스트
 * - 카픽존 상세보기(1건)
 */
@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchMapper branchMapper;

    /** 홈/검색용 */
    public List<BranchHomeDto> getBranchesForHome() {
        return branchMapper.findForHome();
    }

    /** 카픽존 상세보기용 */
    public BranchZoneDetailDto getBranchForZone(long branchId) {
        BranchZoneDetailDto dto = branchMapper.findForZoneDetail(branchId);

        // ✅ 없으면 null 방치하지 말고 즉시 예외로 전환
        if (dto == null) {
            // 커스텀 예외가 있으면 그걸로 교체 추천 (예: ResourceNotFoundException)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Branch not found: " + branchId);
        }

        String code = dto.getBranchCode(); // ex) "SEOUL_STATION"
        List<String> images = List.of(
                "/images/branches/" + code + ".png"
        );
        dto.setImages(images);

        return dto;

    }
}