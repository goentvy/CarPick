package com.carpick.admin.carAdmin.mapper;

import com.carpick.admin.carAdmin.dto.AdminCarSpecDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminCarSpecMapper {

    // 목록 조회 (삭제 안 된 것만)
    List<AdminCarSpecDto> selectList();

    // 단건 조회
    AdminCarSpecDto selectById(@Param("specId") Long specId);

    // 등록
    int insert(AdminCarSpecDto dto);

    // 수정
    int update(AdminCarSpecDto dto);

    // Soft Delete
    int softDelete(@Param("specId") Long specId);

    // 삭제된 데이터 중 같은 이름 있는지 체크 (복구용)
    AdminCarSpecDto selectDeletedByName(@Param("brand") String brand,
                                        @Param("modelName") String modelName,
                                        @Param("modelYearBase") Integer modelYearBase);

    // 복구
    int restore(@Param("specId") Long specId);

    // 참조 체크 (이 차종을 쓰는 차량이 있는지)
    int countVehicleBySpecId(@Param("specId") Long specId);

}
