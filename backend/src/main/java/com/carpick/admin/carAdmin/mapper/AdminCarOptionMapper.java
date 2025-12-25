package com.carpick.admin.carAdmin.mapper;

import com.carpick.admin.carAdmin.dto.AdminCarOptionDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminCarOptionMapper {

    // 특정 차종의 옵션 목록 조회
    List<AdminCarOptionDto> selectListBySpecId(@Param("carSpecId") Long carSpecId);

    // 단건 조회
    AdminCarOptionDto selectById(@Param("optionId") Long optionId);

    // 등록
    int insert(AdminCarOptionDto dto);

    // 수정
    int update(AdminCarOptionDto dto);

    // Soft Delete
    int softDelete(@Param("optionId") Long optionId);

    // 삭제된 데이터 중 같은 이름 있는지 체크 (복구용)
    AdminCarOptionDto selectDeletedByName(@Param("carSpecId") Long carSpecId,
                                          @Param("optionName") String optionName);

    // 복구
    int restore(@Param("optionId") Long optionId);
    // ✅ 추가: 특정 차종의 옵션 전체 Soft Delete
    int softDeleteAllBySpecId(@Param("carSpecId") Long carSpecId);

}
