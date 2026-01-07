package com.carpick.admin.inventoryAdmin.mapper;


import com.carpick.admin.inventoryAdmin.dto.AdminVehicleInventoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminInventoryMapper {
    // 1. 전체 조회 (논리 삭제 제외)
    List<AdminVehicleInventoryDto> findAll();

    // 2. 단건 조회
    AdminVehicleInventoryDto findById(@Param("vehicleId") Long vehicleId);

    // 3. 등록
    int insert(AdminVehicleInventoryDto dto);

    // 4. 수정
    int update(AdminVehicleInventoryDto dto);

    // 5. 논리 삭제 (use_yn = 'N')
    int softDelete(@Param("vehicleId") Long vehicleId);
    // 삭제된 데이터 중 같은 차량번호 있는지 체크
    AdminVehicleInventoryDto selectDeletedByVehicleNo(@Param("vehicleNo") String vehicleNo);

    // 복구
    int restore(@Param("vehicleId") Long vehicleId);

}
