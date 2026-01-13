package com.carpick.domain.zone.dto;

import com.carpick.domain.branch.dto.BranchMapDto;
import com.carpick.domain.dropzone.dto.DropzoneMapDto;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * ✅ Zone Map 응답 DTO
 * - branches + dropzones를 "한 번에" 내려줌
 */
@Getter
@AllArgsConstructor
public class ZoneMapDto {
    private final List<BranchMapDto> branches;
    private final List<DropzoneMapDto> dropzones;
}
