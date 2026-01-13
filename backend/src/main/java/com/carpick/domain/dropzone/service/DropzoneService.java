package com.carpick.domain.dropzone.service;

import com.carpick.domain.dropzone.dto.DropzoneDetailDto;
import com.carpick.domain.dropzone.dto.DropzoneStatusDto;
import com.carpick.domain.dropzone.mapper.DropzoneMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ✅ DropzoneService
 * - 목록: DB 조회
 * - status: (1) 존재/active 확인 -> (2) estimator로 추정 -> (3) inactive면 고정 응답
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DropzoneService {

    private final DropzoneMapper dropzoneMapper;
    private final DropzoneStatusEstimator estimator;

    public List<DropzoneDetailDto> getDropzones(long branchId) {
        return dropzoneMapper.findByBranchId(branchId);
    }

    public DropzoneStatusDto getStatus(long dropzoneId) {
        DropzoneDetailDto check = dropzoneMapper.findById(dropzoneId);

        // ✅ 운영 중지/미존재는 “고정 응답” (추정 로직 타지 않음)
        if (check == null || Boolean.FALSE.equals(check.getIsActive())) {
            return DropzoneStatusDto.builder()
                    .dropzoneId(dropzoneId)
                    .capacity(0)
                    .currentCount(0)
                    .occupancyRate(0.0)
                    .status("INACTIVE")
                    .label("운영중지")
                    .measuredAt(LocalDateTime.now())
                    .build();
        }

        // ✅ 운영 중이면 추정치 생성 (알고리즘은 estimator가 담당)
        return estimator.estimate(dropzoneId);
    }
}
