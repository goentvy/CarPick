package com.carpick.domain.inventory.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface VehicleInventoryMapper {
    /**
     * 비관적 락으로 차량 조회 (SELECT FOR UPDATE)
     * 해당 차량 행에 락을 걸어서 다른 트랜잭션이 수정 못하게 함
     */
    String selectOperationalStatusForUpdate(@Param("vehicleId") Long vehicleId);

    /**
     * 차량 운영 상태 변경
     */
    int updateOperationalStatus(@Param("vehicleId") Long vehicleId,
                                @Param("status") String status);

}
