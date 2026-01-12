package com.carpick.domain.dropzone.mapper;


import com.carpick.domain.dropzone.dto.DropzoneDetailDto;
import com.carpick.domain.dropzone.dto.DropzoneMapDto;
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
    List<DropzoneDetailDto> findByBranchId(@Param("branchId") long branchId);


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
    DropzoneDetailDto findById(@Param("dropzoneId") long dropzoneId);

    /**
     * ✅ 지도/마커용: 드롭존 포인트 전체
     * - active + not deleted 기준
     */
    @Select("""
        SELECT
            dropzone_id       AS dropzoneId,
            branch_id         AS branchId,
            dropzone_name     AS dropzoneName,
            address_text      AS addressText,
            location_desc     AS locationDesc,
            walking_time_min  AS walkingTimeMin,
            CAST(latitude     AS DOUBLE) AS latitude,
            CAST(longitude    AS DOUBLE) AS longitude,
            is_active         AS isActive
        FROM DROPZONE_POINT
        WHERE deleted_at IS NULL
          AND is_active = 1
        ORDER BY dropzone_id ASC
    """)
    List<DropzoneMapDto> findForMap();

}

