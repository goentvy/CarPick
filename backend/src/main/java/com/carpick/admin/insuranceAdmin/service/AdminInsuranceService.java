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

    @Transactional(readOnly = true)
    public List<AdminInsuranceDto> getInsuranceList() {
        return insuranceMapper.selectList();
    }

    @Transactional(readOnly = true)
    public AdminInsuranceDto getInsuranceById(Long insuranceId) {
        return insuranceMapper.selectById(insuranceId);
    }

    // ==================== UPDATE (핵심!) ====================

    /**
     * 보험 옵션 수정
     * - 안전 장치: DB에서 기존 데이터를 먼저 조회한 뒤, 변경할 필드만 덮어씁니다.
     * - 보험 코드(insuranceCode)는 절대 변경되지 않도록 보호합니다.
     */
    public void updateInsurance(AdminInsuranceDto dto) {
        // 1. 기존 데이터 조회 (안전 장치)
        AdminInsuranceDto existing = insuranceMapper.selectById(dto.getInsuranceId());

        if (existing == null) {
            throw new IllegalStateException("수정할 보험 정보가 존재하지 않습니다. ID=" + dto.getInsuranceId());
        }

        // 2. 수정 가능한 필드만 갱신 (보험 코드는 건드리지 않음!)
        // 기존 객체(existing)에 화면에서 넘어온 값(dto)을 덮어씌웁니다.
        existing.setInsuranceLabel(dto.getInsuranceLabel());               // 보험명
        existing.setSummaryLabel(dto.getSummaryLabel());   // 설명
        existing.setExtraDailyPrice(dto.getExtraDailyPrice()); // 가격
        existing.setIsDefault(dto.getIsDefault());         // 기본값 여부
        existing.setIsActive(dto.getIsActive());           // 활성 여부
        existing.setSortOrder(dto.getSortOrder());         // 정렬 순서

        // 주의: existing.setInsuranceCode(...) 는 절대 호출하지 않음!

        // 3. 업데이트 실행
        // (Mapper XML에서는 모든 필드를 업데이트하더라도, existing 객체에는 이미 안전한 코드값이 들어있음)
        int updatedRows = insuranceMapper.update(existing);

        if (updatedRows == 0) {
            throw new IllegalStateException("업데이트 실패: 데이터가 변경되지 않았습니다.");
        }
    }

    // ==================== [삭제됨] CREATE / DELETE ====================
    // 정책 변경: 보험 종류는 고정(ENUM)이므로 관리자 페이지에서 추가/삭제 기능을 제공하지 않습니다.
    // 필요 시 개발자가 DB 초기화 스크립트(INSERT)로 관리합니다.

    /* public void addInsurance(...) { ... 삭제됨 ... }
    public void deleteInsurance(...) { ... 삭제됨 ... }
    */
}
