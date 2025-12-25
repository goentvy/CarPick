package com.carpick.admin.insuranceAdmin.service;
import com.carpick.admin.insuranceAdmin.dto.AdminInsuranceDto;
import com.carpick.admin.insuranceAdmin.mapper.AdminInsuranceMapper;
import com.carpick.domain.insurance.enums.InsuranceCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminInsuranceService {
    private final AdminInsuranceMapper insuranceMapper;

    // ==================== READ ====================

    /**
     * 보험 옵션 목록 조회
     * - use_yn = 'Y' 인 것만
     * - 정렬은 XML에서: sort_order ASC, extra_daily_price ASC, updated_at DESC
     */
    @Transactional(readOnly = true)
    public List<AdminInsuranceDto> getInsuranceList() {
        return insuranceMapper.selectList();
    }

    /**
     * 보험 옵션 단건 조회
     * - use_yn = 'Y' 인 것만 조회
     */
    @Transactional(readOnly = true)
    public AdminInsuranceDto getInsuranceById(Long insuranceId) {
        return insuranceMapper.selectById(insuranceId);
    }

    // ==================== CREATE / UPDATE ====================

    /**
     * 보험 옵션 등록
     *
     * 1) 같은 insuranceCode 가 "삭제된 상태(use_yn = 'N')"로 이미 있으면
     *    → 해당 row 복구 + 새 값으로 UPDATE
     *
     * 2) 그런 코드가 전혀 없으면
     *    → 새로 INSERT
     *
     * 이렇게 해두면, 실수로 삭제했다가 다시 추가할 때
     * 히스토리(기존 PK)를 그대로 이어갈 수 있습니다.
     */
    public void addInsurance(AdminInsuranceDto dto) {

        // 1. 코드(ENUM) 꺼내기
        InsuranceCode code = dto.getInsuranceCode();

        // 2. 같은 코드로, 삭제된(use_yn = 'N') row가 있는지 확인
        AdminInsuranceDto deleted = insuranceMapper.selectDeletedByCode(code);

        if (deleted != null) {
            // ========== [CASE A] : 삭제된 이력이 있음 → 복구 + 업데이트 ==========

            // 2-1. 우선 복구 (use_yn = 'Y', deleted_at = NULL)
            insuranceMapper.restore(deleted.getInsuranceId());

            // 2-2. 이번에 입력한 내용으로 덮어쓰기 위해 ID를 기존 것에 맞춰줌
            dto.setInsuranceId(deleted.getInsuranceId());

            // 2-3. UPDATE로 최신 값 반영
            insuranceMapper.update(dto);

        } else {
            // ========== [CASE B] : 완전 신규 코드 → INSERT ==========

            insuranceMapper.insert(dto);
        }
    }

    /**
     * 보험 옵션 수정
     *
     * - use_yn = 'Y' 인 데이터만 수정 가능 (XML WHERE 조건)
     * - 수정 대상이 없으면 예외 던져서 컨트롤러에서 메시지 처리 가능
     */
    public void updateInsurance(AdminInsuranceDto dto) {
        int updatedRows = insuranceMapper.update(dto);

        if (updatedRows == 0) {
            // 이미 삭제됐거나, ID가 잘못된 경우
            throw new IllegalStateException("수정할 수 있는 보험 정보가 없습니다. (이미 삭제되었거나 잘못된 ID입니다)");
        }
    }

    // ==================== DELETE ====================

    /**
     * 보험 옵션 삭제 (Soft Delete)
     *
     * 1) RESERVATION 테이블에서 이 보험을 참조 중인지 카운트
     *    - 1건이라도 있으면 삭제 불가 (예외 발생)
     *
     * 2) 참조가 없으면 softDelete 실행
     *    - use_yn = 'N', deleted_at = NOW()
     */
    public void deleteInsurance(Long insuranceId) {

        // 1. 참조 여부 체크
        int reservationCount = insuranceMapper.countReservationByInsuranceId(insuranceId);

        if (reservationCount > 0) {
            // 이 예외 메시지는 컨트롤러에서 그대로 프론트에 내려주면 됩니다.
            throw new IllegalStateException(
                    "이 보험을 사용 중인 예약이 " + reservationCount + "건 있어 삭제할 수 없습니다."
            );
        }

        // 2. 실제 논리 삭제 수행
        insuranceMapper.softDelete(insuranceId);
    }
}
