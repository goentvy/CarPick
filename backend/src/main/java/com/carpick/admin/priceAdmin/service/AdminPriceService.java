package com.carpick.admin.priceAdmin.service;



import com.carpick.admin.priceAdmin.dto.AdminPriceDto;
import com.carpick.admin.priceAdmin.mapper.AdminPriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminPriceService {

    private final AdminPriceMapper priceMapper;

    // ======================================================
    //  🔎 조회
    // ======================================================

    /**
     * 전체 목록 조회
     */
    public List<AdminPriceDto> getPriceList() {
        return priceMapper.selectList();
    }

    /**
     * 단건 조회 (specId 기준)
     */
    public AdminPriceDto getPriceBySpecId(Long specId) {
        if (specId == null) {
            throw new IllegalArgumentException("specId : 차종 아이디는 null일 수 없습니다.");
        }

        AdminPriceDto dto = priceMapper.selectBySpecId(specId);
        if (dto == null) {
            throw new IllegalStateException(
                    "해당 차종의 가격 정보를 찾을 수 없습니다. (specId=" + specId + ")"
            );
        }
        return dto;
    }

    // ======================================================
    //  📝 저장 (INSERT / UPDATE)
    // ======================================================

    /**
     * 가격 저장
     * - priceId == null → INSERT
     * - priceId != null → UPDATE (낙관적 락 적용)
     */
    @Transactional
    public void savePrice(AdminPriceDto dto) {
        validateForSave(dto);

        if (dto.getPriceId() == null) {
            // 신규 등록
            int inserted = priceMapper.insertPrice(dto);
            if (inserted == 0) {
                throw new IllegalStateException("가격 정보 등록에 실패했습니다.");
            }
        } else {
            // 수정 (낙관적 락)
            int updated = priceMapper.updatePriceWithVersion(dto);
            if (updated == 0) {
                throw new IllegalStateException(
                        "다른 관리자가 먼저 수정했습니다. 새로고침 후 다시 시도해주세요."
                );
            }
        }
    }
    /**
     * 긴급 비활성화 (운영 사고 대응)
     */
    @Transactional
    public void deactivatePrice(Long priceId, Integer version) {
        int result = priceMapper.softDeletePrice(priceId, version);
        if (result == 0) {
            throw new IllegalStateException(
                    "비활성화 실패: 이미 변경되었거나 존재하지 않습니다."
            );
        }
    }

    /**
     * 재활성화 (복구)
     */
    @Transactional
    public void activatePrice(Long priceId, Integer version) {
        int result = priceMapper.restorePrice(priceId, version);
        if (result == 0) {
            throw new IllegalStateException(
                    "활성화 실패: 이미 변경되었거나 존재하지 않습니다."
            );
        }
    }

    // ======================================================
    //  🔐 검증 로직
    // ======================================================

    private void validateForSave(AdminPriceDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("요청 데이터가 비어있습니다.");
        }

        if (dto.getSpecId() == null) {
            throw new IllegalArgumentException("specId(차종 ID)는 필수입니다.");
        }

        if (dto.getDailyPrice() != null && isNegative(dto.getDailyPrice())) {
            throw new IllegalArgumentException("일단가는 0 이상이어야 합니다.");
        }

        if (dto.getMonthlyPrice() != null && isNegative(dto.getMonthlyPrice())) {
            throw new IllegalArgumentException("월단가는 0 이상이어야 합니다.");
        }
        // update일 때는 낙관적 락 필수
        if (dto.getPriceId() != null && dto.getVersion() == null) {
            throw new IllegalArgumentException("수정 시 version 값은 필수입니다.");
        }

    }

    private boolean isNegative(BigDecimal value) {
        return value.compareTo(BigDecimal.ZERO) < 0;
    }
}