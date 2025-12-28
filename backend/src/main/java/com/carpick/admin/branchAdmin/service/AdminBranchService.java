package com.carpick.admin.branchAdmin.service;


import com.carpick.admin.branchAdmin.dto.AdminBranchDto;
import com.carpick.admin.branchAdmin.mapper.AdminBranchMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminBranchService {
    private final AdminBranchMapper branchMapper;

    // ======================================================
    // 🔎 조회 계열 (readOnly = true)
    // ======================================================

    /** ✅ 지점 목록 조회 (use_yn = 'Y' 만) */
    @Transactional(readOnly = true)
    public List<AdminBranchDto> getBranchList() {
        return branchMapper.selectList();
    }

    /** ✅ 지점 단건 조회 */
    @Transactional(readOnly = true)
    public AdminBranchDto getBranch(Long branchId) {
        if (branchId == null) {
            throw new IllegalArgumentException("branchId는 null일 수 없습니다.");
        }
        AdminBranchDto dto = branchMapper.selectById(branchId);
        if (dto == null) {
            throw new IllegalStateException("해당 지점(branchId=" + branchId + ")을 찾을 수 없습니다.");
        }
        return dto;
    }

    // ======================================================
    // 📝 등록 / 수정
    // ======================================================

    /**
     * 📝 지점 등록
     * - 지점 코드(branch_code)는 UNIQUE
     * - 이미 삭제된 이력이 있는 코드면 → 복구 + 최신 정보로 업데이트
     * - 완전 신규 코드면 → 단순 INSERT
     */
    public void addBranch(AdminBranchDto dto) {
        // 1️⃣ 필수값 / 비즈니스 룰 / 문자열 정리
        validateRequiredFields(dto);
        validateBusinessRules(dto);
        normalizeFields(dto);

        // 2️⃣ 삭제된 지점 중 같은 코드가 있는지 확인
        AdminBranchDto deleted = branchMapper.selectDeletedByCode(dto.getBranchCode());

        if (deleted != null) {
            // ✅ [CASE A] 예전에 삭제했던 지점 → 복구 후 최신 데이터로 덮어쓰기
            // 2-1. 우선 use_yn = 'Y', deleted_at = NULL 로 복구
            branchMapper.restore(deleted.getBranchId());

            // 2-2. 이번에 입력한 값 기준으로 다시 업데이트
            dto.setBranchId(deleted.getBranchId());
            branchMapper.update(dto);

        } else {
            // ✅ [CASE B] 완전히 새로운 지점 → INSERT
            branchMapper.insert(dto);
        }
    }

    /**
     * 🛠 지점 정보 수정
     * - 인라인 편집 / 상세 수정 모두 이 메서드로 처리
     */
    public void updateBranch(AdminBranchDto dto) {
        if (dto.getBranchId() == null) {
            throw new IllegalArgumentException("지점을 수정하려면 branchId가 필요합니다.");
        }

        validateRequiredFields(dto);   // 수정에서도 기본값 유지
        validateBusinessRules(dto);
        normalizeFields(dto);

        int updated = branchMapper.update(dto);
        if (updated == 0) {
            throw new IllegalStateException("수정할 지점을 찾을 수 없거나 이미 삭제된 상태입니다.");
        }
    }

    // ======================================================
    // 🚫 삭제 / 복구
    // ======================================================

    /**
     * 🚫 지점 삭제 (Soft Delete)
     * - VEHICLE_INVENTORY에서 해당 지점을 참조 중이면 삭제 불가
     */
    public void softDeleteBranch(Long branchId) {
        if (branchId == null) {
            throw new IllegalArgumentException("지점을 삭제하려면 branchId가 필요합니다.");
        }

        // 이 지점을 사용하는 차량 재고가 있는지 체크
        int refCount = branchMapper.countInventoryByBranchId(branchId);
        if (refCount > 0) {
            throw new IllegalStateException(
                    "해당 지점을 사용하는 차량 재고가 " + refCount + "건 존재합니다. " +
                            "모든 차량 재고를 다른 지점으로 이동하거나 삭제한 후 지점을 삭제할 수 있습니다."
            );
        }

        branchMapper.softDelete(branchId);
    }

    /**
     * 🔄 지점 복구
     * - 필요 없으면 사용하지 않으셔도 됩니다.
     */
    public void restoreBranch(Long branchId) {
        if (branchId == null) {
            throw new IllegalArgumentException("지점을 복구하려면 branchId가 필요합니다.");
        }
        branchMapper.restore(branchId);
    }

    // ======================================================
    //  🔐 내부 검증 / 정규화 메서드
    // ======================================================

    /**
     * ✅ 필수값 검증
     * - MVP 기준으로 “지점 코드 / 지점명 / 기본주소 / 전화번호” 정도만 강하게 체크
     */
    private void validateRequiredFields(AdminBranchDto dto) {


        if (isBlank(dto.getBranchCode())) {
            throw new IllegalArgumentException("지점 코드는 필수 입력값입니다.");
        }
        if (isBlank(dto.getBranchName())) {
            throw new IllegalArgumentException("지점명은 필수 입력값입니다.");
        }
        if (isBlank(dto.getAddressBasic())) {
            throw new IllegalArgumentException("기본 주소는 필수 입력값입니다.");
        }
        if (isBlank(dto.getPhone())) {
            throw new IllegalArgumentException("지점 전화번호는 필수 입력값입니다.");
        }
        validatePhoneFormat(dto.getPhone());


    }
    private void validatePhoneFormat(String phone) {

        if (isBlank(phone)) {
            throw new IllegalArgumentException("지점 전화번호는 필수 입력값입니다.");
        }

        // 숫자, +, -, 공백만 허용
        if (!phone.matches("^[0-9+\\- ]{8,20}$")) {
            throw new IllegalArgumentException("전화번호 형식이 올바르지 않습니다. 예) 010-1234-5678");
        }
    }


    /**
     * ✅ 비즈니스 규칙 검증
     * - 예: 오픈 시간 < 마감 시간 등
     */
    private void validateBusinessRules(AdminBranchDto dto) {
        LocalTime open = dto.getOpenTime();
        LocalTime close = dto.getCloseTime();

        // TODO: 24시간 영업 지점, 점심 브레이크 타임 등은 필요 시 확장
        if (open != null && close != null && !close.isAfter(open)) {
            throw new IllegalArgumentException("마감 시간은 오픈 시간보다 늦어야 합니다. (예: 09:00 ~ 18:00)");
        }
    }

    /**
     * ✅ 문자열/기본값 정리
     * - 공백만 있는 문자열은 null로 통일
     * - useYn이 비어 있으면 'Y'로 세팅
     */
    private void normalizeFields(AdminBranchDto dto) {
        dto.setBranchCode(trimToNull(dto.getBranchCode()));
        dto.setBranchName(trimToNull(dto.getBranchName()));
        dto.setAddressBasic(trimToNull(dto.getAddressBasic()));
        dto.setAddressDetail(trimToNull(dto.getAddressDetail()));
        dto.setPhone(trimToNull(dto.getPhone()));
        dto.setBusinessHours(trimToNull(dto.getBusinessHours()));
        dto.setRegionDept1(trimToNull(dto.getRegionDept1()));

        if (isBlank(dto.getUseYn())) {
            dto.setUseYn("Y");
        }
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
