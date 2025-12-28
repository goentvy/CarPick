package com.carpick.admin.inventoryAdmin.service;


import com.carpick.admin.inventoryAdmin.dto.AdminVehicleInventoryDto;
import com.carpick.admin.inventoryAdmin.mapper.AdminInventoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInventoryService {
    private final AdminInventoryMapper inventoryMapper;

    // 1. 목록 조회
    public List<AdminVehicleInventoryDto> getAllVehicles() {
        return inventoryMapper.findAll();
    }

    // 2. 상세 조회
    public AdminVehicleInventoryDto getVehicleDetail(Long vehicleId) {
        if (vehicleId == null) {
            throw new IllegalArgumentException("vehicleId는 null일 수 없습니다.");
        }
        AdminVehicleInventoryDto dto = inventoryMapper.findById(vehicleId);
        if (dto == null) {
            throw new IllegalStateException("해당 차량(vehicleId=" + vehicleId + ")을 찾을 수 없습니다.");
        }
        return dto;
    }

    // 3. 등록 (삭제된 동일 차량번호 있으면 복구)
    @Transactional
    public void registerVehicle(AdminVehicleInventoryDto dto) {
        validateRequiredFields(dto);

        // 삭제된 동일 차량번호 있는지 확인
        AdminVehicleInventoryDto deleted = inventoryMapper.selectDeletedByVehicleNo(dto.getVehicleNo());

        if (deleted != null) {
            // 복구 후 최신 정보로 업데이트
            inventoryMapper.restore(deleted.getVehicleId());
            dto.setVehicleId(deleted.getVehicleId());
            inventoryMapper.update(dto);
        } else {
            inventoryMapper.insert(dto);
        }
    }

    // 4. 수정
    @Transactional
    public void modifyVehicle(AdminVehicleInventoryDto dto) {
        if (dto.getVehicleId() == null) {
            throw new IllegalArgumentException("수정하려면 vehicleId가 필요합니다.");
        }
        validateRequiredFields(dto);

        int updated = inventoryMapper.update(dto);
        if (updated == 0) {
            throw new IllegalStateException("수정할 차량을 찾을 수 없거나 이미 삭제된 데이터입니다.");
        }
    }

    // 5. 삭제 (논리 삭제)
    @Transactional
    public void removeVehicle(Long vehicleId) {
        if (vehicleId == null) {
            throw new IllegalArgumentException("삭제하려면 vehicleId가 필요합니다.");
        }
        int deleted = inventoryMapper.softDelete(vehicleId);
        if (deleted == 0) {
            throw new IllegalStateException("이미 삭제되었거나 존재하지 않는 차량입니다.");
        }
    }

    // 6. 복구
    @Transactional
    public void restoreVehicle(Long vehicleId) {
        if (vehicleId == null) {
            throw new IllegalArgumentException("복구하려면 vehicleId가 필요합니다.");
        }
        int updated = inventoryMapper.restore(vehicleId);
        if (updated == 0) {
            throw new IllegalStateException("복구할 수 없는 차량입니다.");
        }
    }

    // ====== 필수값 검증 ======
    private void validateRequiredFields(AdminVehicleInventoryDto dto) {
        if (dto.getSpecId() == null) {
            throw new IllegalArgumentException("차량 스펙(specId)은 필수입니다.");
        }
        if (dto.getBranchId() == null) {
            throw new IllegalArgumentException("지점(branchId)은 필수입니다.");
        }
        if (dto.getVehicleNo() == null || dto.getVehicleNo().trim().isEmpty()) {
            throw new IllegalArgumentException("차량번호는 필수입니다.");
        }
    }


}
