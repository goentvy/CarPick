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

    // 차량 재고 MyBatis Mapper
    private final AdminInventoryMapper adminVehicleInventoryMapper;

    // 1. 목록 조회
    public List<AdminVehicleInventoryDto> getAllVehicles() {
        return adminVehicleInventoryMapper.findAll();
    }

    // 2. 상세 조회
    public AdminVehicleInventoryDto getVehicleDetail(Long vehicleId) {
        return adminVehicleInventoryMapper.findById(vehicleId);
        // 필요하면 여기서 null 체크 후 예외 던지는 방식으로 강화할 수 있음
        // (지금은 컨트롤러에서 null 처리하는 쪽으로 열어둔 상태)
    }

    // 3. 등록
    @Transactional
    public void registerVehicle(AdminVehicleInventoryDto dto) {
        adminVehicleInventoryMapper.insert(dto);
        // INSERT 후 dto.getVehicleId() 에 PK가 세팅됨 (useGeneratedKeys=true)
    }

    // 4. 수정 (0건 수정 시 예외 던지기)
    @Transactional
    public void modifyVehicle(AdminVehicleInventoryDto dto) {
        int updated = adminVehicleInventoryMapper.update(dto);

        if (updated == 0) {
            // 대상이 없거나(use_yn='N' 이거나), 잘못된 ID인 경우
            throw new IllegalStateException(
                    "수정할 수 있는 차량 재고가 없습니다. (이미 삭제되었거나 잘못된 ID입니다. ID=" + dto.getVehicleId() + ")"
            );
        }
    }

    // 5. 삭제 (논리 삭제, 0건 삭제 시 예외 던지기)
    @Transactional
    public void removeVehicle(Long vehicleId) {
        int deleted = adminVehicleInventoryMapper.softDelete(vehicleId);

        if (deleted == 0) {
            // 이미 삭제된 데이터거나, 잘못된 ID
            throw new IllegalStateException(
                    "삭제할 수 있는 차량 재고가 없습니다. (이미 삭제되었거나 잘못된 ID입니다. ID=" + vehicleId + ")"
            );
        }
    }

}
