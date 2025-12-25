package com.carpick.admin.carAdmin.service;


import com.carpick.admin.carAdmin.dto.AdminCarOptionDto;
import com.carpick.admin.carAdmin.dto.AdminCarSpecDto;
import com.carpick.admin.carAdmin.mapper.AdminCarOptionMapper;
import com.carpick.admin.carAdmin.mapper.AdminCarSpecMapper;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCarService {

    private final AdminCarSpecMapper carSpecMapper;
    private final AdminCarOptionMapper carOptionMapper;

    // ==================== CarSpec ====================

    @Transactional(readOnly = true)
    public List<AdminCarSpecDto> getCarSpecList() {
        return carSpecMapper.selectList();
    }

    @Transactional(readOnly = true)
    public AdminCarSpecDto getCarSpecById(Long specId) {
        return carSpecMapper.selectById(specId);
    }

    /**
     * 차종 등록 (삭제된 동일 데이터 있으면 복구 + 내용 갱신)
     */
    public void addCarSpec(AdminCarSpecDto dto) {
        // 1. 삭제된 데이터 중 같은 키(브랜드/모델/연식) 확인
        AdminCarSpecDto deleted = carSpecMapper.selectDeletedByName(
                dto.getBrand(),
                dto.getModelName(),
                dto.getModelYearBase()
        );

        if (deleted != null) {
            // [CASE A] 복구 로직
            // 1. 되살린다 (use_yn = 'Y')
            carSpecMapper.restore(deleted.getSpecId());

            // ✅ [추가 1] 되살린 데이터에 이번에 입력한 최신 정보 덮어쓰기!
            // ID를 기존(삭제됐던) ID로 세팅해주고 update를 날려야 함
            dto.setSpecId(deleted.getSpecId());
            carSpecMapper.update(dto);

        } else {
            // [CASE B] 신규 등록
            carSpecMapper.insert(dto);
        }
    }

    public void updateCarSpec(AdminCarSpecDto dto) {
        carSpecMapper.update(dto);
    }

    /**
     * 차종 삭제 (Soft Delete)
     * - 참조 중인 실제 차량(Vehicle) 체크
     * - ✅ [추가] 딸려있는 옵션도 같이 삭제 처리
     */
    public void deleteCarSpec(Long specId) {
        // 1. 이 차종을 쓰고 있는 '실물 차량(Vehicle)'이 있는지 체크 (있으면 삭제 불가)
        int vehicleCount = carSpecMapper.countVehicleBySpecId(specId);
        if (vehicleCount > 0) {
            throw new IllegalStateException(
                    "이 차종을 등록하여 운행 중인 차량이 " + vehicleCount + "대 있습니다. 먼저 차량을 처리해주세요."
            );
        }

        // 2. 차종 삭제 (Soft Delete)
        carSpecMapper.softDelete(specId);

        // ✅ [추가 2] 차종이 삭제되면, 해당 차종에 종속된 옵션들도 같이 안 보이게 처리하는 것이 안전함
        // (필요 시 Mapper에 deleteOptionsBySpecId 같은 메서드 추가 필요)
        // carOptionMapper.softDeleteAllBySpecId(specId);
    }

    // ==================== CarOption ====================

    @Transactional(readOnly = true)
    public List<AdminCarOptionDto> getOptionListBySpecId(Long carSpecId) {
        return carOptionMapper.selectListBySpecId(carSpecId);
    }

    @Transactional(readOnly = true)
    public AdminCarOptionDto getOptionById(Long optionId) {
        return carOptionMapper.selectById(optionId);
    }

    /**
     * 옵션 등록 (삭제된 동일 데이터 있으면 복구 + 내용 갱신)
     */
    public void addCarOption(AdminCarOptionDto dto) {
        AdminCarOptionDto deleted = carOptionMapper.selectDeletedByName(
                dto.getCarSpecId(),
                dto.getOptionName()
        );

        if (deleted != null) {
            // 1. 복구
            carOptionMapper.restore(deleted.getOptionId());

            // ✅ [추가 3] 복구 후 최신 내용으로 업데이트 (가격 변동 반영 등)
            dto.setOptionId(deleted.getOptionId());
            carOptionMapper.update(dto);

        } else {
            // 2. 신규
            carOptionMapper.insert(dto);
        }
    }

    public void updateCarOption(AdminCarOptionDto dto) {
        carOptionMapper.update(dto);
    }

    public void deleteCarOption(Long optionId) {
        carOptionMapper.softDelete(optionId);
    }

}
