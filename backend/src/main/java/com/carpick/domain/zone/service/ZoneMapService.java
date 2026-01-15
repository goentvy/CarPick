package com.carpick.domain.zone.service;

import com.carpick.domain.branch.dto.BranchMapDto;
import com.carpick.domain.branch.mapper.BranchMapper;
import com.carpick.domain.dropzone.dto.DropzoneMapDto;
import com.carpick.domain.dropzone.mapper.DropzoneMapper;
import com.carpick.domain.zone.dto.ZoneMapDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ✅ ZoneMapService
 * - Branch + Dropzone의 map 데이터를 합쳐서 내려줌
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ZoneMapService {

    private final BranchMapper branchMapper;
    private final DropzoneMapper dropzoneMapper;

    /**
     * ✅ 전체 지도 데이터(브랜치+드롭존) 1회 호출
     * - 프론트는 이거 하나로 ALL/BRANCH/DROP 필터를 구현 가능
     */
    public ZoneMapDto getZoneMap() {
        List<BranchMapDto> branches = branchMapper.findForMap();
        List<DropzoneMapDto> dropzones = dropzoneMapper.findForMap();

        // ✅ 최소 로깅 1회: 운영 시 데이터 규모 파악에 도움
        log.info("[ZoneMap] branches={}, dropzones={}", branches.size(), dropzones.size());

        return new ZoneMapDto(branches, dropzones);
    }
}
