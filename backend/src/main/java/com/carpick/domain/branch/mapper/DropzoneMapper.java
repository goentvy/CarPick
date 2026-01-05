package com.carpick.domain.branch.mapper;

import com.carpick.domain.branch.dto.DropzonePointDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DropzoneMapper {

    @Select("""
        SELECT
            dropzone_id       AS dropzoneId,
            branch_id         AS branchId,
            dropzone_code     AS dropzoneCode,
            dropzone_name     AS dropzoneName,
            address_text      AS addressText,
            location_desc     AS locationDesc,
            walking_time_min  AS walkingTimeMin,
            latitude          AS latitude,
            longitude         AS longitude,
            service_hours     AS serviceHours,
            is_active         AS isActive
        FROM DROPZONE_POINT
        WHERE branch_id = #{branchId}
          AND is_active = 1
          AND deleted_at IS NULL
        ORDER BY dropzone_id ASC
    """)
    List<DropzonePointDto> findByBranchId(@Param("branchId") long branchId);


    @Select("""
        SELECT
            dropzone_id       AS dropzoneId,
            branch_id         AS branchId,
            dropzone_code     AS dropzoneCode,
            dropzone_name     AS dropzoneName,
            address_text      AS addressText,
            location_desc     AS locationDesc,
            walking_time_min  AS walkingTimeMin,
            latitude          AS latitude,
            longitude         AS longitude,
            service_hours     AS serviceHours,
            is_active         AS isActive
        FROM DROPZONE_POINT
        WHERE dropzone_id = #{dropzoneId}
          AND deleted_at IS NULL
        LIMIT 1
    """)
    DropzonePointDto findById(@Param("dropzoneId") long dropzoneId);
}
