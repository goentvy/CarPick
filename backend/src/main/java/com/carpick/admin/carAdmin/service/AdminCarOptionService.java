package com.carpick.admin.carAdmin.service;


import com.carpick.admin.carAdmin.dto.AdminCarOptionDto;
import com.carpick.admin.carAdmin.mapper.AdminCarOptionMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCarOptionService {
    private final AdminCarOptionMapper optionMapper;

    /** 🔎 목록 조회 */
    @Transactional(readOnly = true)
    public List<AdminCarOptionDto> getOptionList() {
        return optionMapper.selectList();
    }

    /** 🔎 단건 조회 */
    @Transactional(readOnly = true)
    public AdminCarOptionDto getOption(Long optionId) {
        if (optionId == null) {
            throw new IllegalArgumentException("optionId는 null일 수 없습니다.");
        }
        AdminCarOptionDto dto = optionMapper.selectById(optionId);
        if (dto == null) {
            throw new IllegalStateException("해당 옵션(optionId=" + optionId + ")을 찾을 수 없습니다.");
        }
        return dto;
    }

    /**
     * 📝 옵션 등록 (삭제된 동일 데이터 있으면 복구)
     */
    public void addOption(AdminCarOptionDto dto) {
        // 1. 필수값 검증
        validateRequiredFields(dto);

        // 2. 문자열 정리
        normalizeFields(dto);

        // 3. 삭제된 동일 이름 옵션 있는지 확인
        AdminCarOptionDto deleted = optionMapper.selectDeletedByName(dto.getOptionName());

        if (deleted != null) {
            // 복구 후 최신 정보로 업데이트
            optionMapper.restore(deleted.getOptionId());
            dto.setOptionId(deleted.getOptionId());
            optionMapper.update(dto);
        } else {
            // 신규 등록
            optionMapper.insert(dto);
        }
    }

    /** 🛠 옵션 수정 */
    public void updateOption(AdminCarOptionDto dto) {
        if (dto.getOptionId() == null) {
            throw new IllegalArgumentException("수정하려면 optionId가 필요합니다.");
        }

        validateRequiredFields(dto);
        normalizeFields(dto);

        int updated = optionMapper.update(dto);
        if (updated == 0) {
            throw new IllegalStateException("수정할 옵션을 찾을 수 없거나 이미 삭제된 데이터입니다.");
        }
    }

    /** 🚫 옵션 삭제 (Soft Delete) */
    public void deleteOption(Long optionId) {
        if (optionId == null) {
            throw new IllegalArgumentException("삭제하려면 optionId가 필요합니다.");
        }
        int updated = optionMapper.softDelete(optionId);
        if (updated == 0) {
            throw new IllegalStateException("이미 삭제되었거나 존재하지 않는 옵션입니다.");
        }
    }

    /** 🔄 삭제된 옵션 복구 */
    public void restoreOption(Long optionId) {
        if (optionId == null) {
            throw new IllegalArgumentException("복구하려면 optionId가 필요합니다.");
        }
        int updated = optionMapper.restore(optionId);
        if (updated == 0) {
            throw new IllegalStateException("복구할 수 없는 옵션입니다.");
        }
    }

    // ======================================================================
    //  🔐 내부 검증 메서드
    // ======================================================================

    private void validateRequiredFields(AdminCarOptionDto dto) {
        if (isBlank(dto.getOptionName())) {
            throw new IllegalArgumentException("옵션명은 필수 입력값입니다.");
        }
        if (dto.getOptionDailyPrice() == null) {
            throw new IllegalArgumentException("1일 대여료는 필수 입력값입니다.");
        }
        if (dto.getOptionDailyPrice() < 0) {
            throw new IllegalArgumentException("1일 대여료는 0 이상이어야 합니다.");
        }
    }

    private void normalizeFields(AdminCarOptionDto dto) {
        dto.setOptionName(trimToNull(dto.getOptionName()));
        dto.setOptionDescription(trimToNull(dto.getOptionDescription()));

        // isHighlight 기본값
        if (dto.getIsHighlight() == null) {
            dto.setIsHighlight(false);
        }
        // useYn은 DB 쪽 정책으로 관리 (insert에서 'Y'로 세팅)
    }

    // ====== String 유틸 ======
    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }


}
