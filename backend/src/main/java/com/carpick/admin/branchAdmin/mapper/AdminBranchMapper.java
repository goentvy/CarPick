package com.carpick.admin.branchAdmin.mapper;


import com.carpick.admin.branchAdmin.dto.AdminBranchDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminBranchMapper {

    /** ✅ 지점 목록 (use_yn = 'Y' 만) */
    List<AdminBranchDto> selectList();

    /** ✅ 단건 조회 (수정용) */
    AdminBranchDto selectById(@Param("branchId") Long branchId);

    /** ✅ 신규 등록 */
    int insert(AdminBranchDto dto);

    /** ✅ 수정 */
    int update(AdminBranchDto dto);

    /** ✅ 논리 삭제 */
    int softDelete(@Param("branchId") Long branchId);

    /** ✅ 삭제된 지점 중 같은 코드 존재 여부 체크 (복구용) */
    AdminBranchDto selectDeletedByCode(@Param("branchCode") String branchCode);

    /** ✅ 복구 */
    int restore(@Param("branchId") Long branchId);

    /** ✅ 참조 체크 (해당 지점을 쓰는 차량 재고가 있는지) */
    int countInventoryByBranchId(@Param("branchId") Long branchId);

}
