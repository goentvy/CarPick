package com.carpick.domain.branch.mapper;

import com.carpick.domain.branch.dto.BranchHomeDto;
import com.carpick.domain.branch.dto.BranchZoneDetailDto;
import com.carpick.domain.branch.dto.BranchMapDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * BranchMapper (MyBatis Annotation 기반)
 * - XML 없이 @Select로만 구성
 */
@Mapper
public interface BranchMapper {

    /**
     * ✅ 홈/검색 지점 리스트
     * - 가벼운 필드만
     */
    @Select("""
        SELECT
            branch_id      AS branchId,
            branch_name    AS branchName,
            address_basic  AS addressBasic,
            business_hours AS businessHours,
            (CASE WHEN use_yn = 'Y' THEN 1 ELSE 0 END) AS isActive
        FROM BRANCH
        WHERE use_yn = 'Y'
        ORDER BY branch_id ASC
    """)
    List<BranchHomeDto> findForHome();

    /**
     * ✅ 카픽존 상세보기용 1건 조회
     */
    @Select("""
    SELECT
        branch_id      AS branchId,
        branch_code    AS branchCode,
        branch_name    AS branchName,
        address_basic  AS addressBasic,
        address_detail AS addressDetail,
        phone          AS phone,
        CAST(latitude  AS DOUBLE) AS latitude,
        CAST(longitude AS DOUBLE) AS longitude,
        business_hours AS businessHours,
        DATE_FORMAT(open_time, '%H:%i')  AS openTime,
        DATE_FORMAT(close_time, '%H:%i') AS closeTime,
        (CASE WHEN use_yn = 'Y' THEN 1 ELSE 0 END) AS isActive,

        CASE
            WHEN use_yn = 'Y'
             AND open_time IS NOT NULL
             AND close_time IS NOT NULL
             AND (
                (open_time <= close_time AND TIME(NOW()) BETWEEN open_time AND close_time)
                OR
                (open_time > close_time AND (TIME(NOW()) >= open_time OR TIME(NOW()) <= close_time))
             )
            THEN 'OPEN'
            ELSE 'CLOSED'
        END AS openStatus,

        CASE
            WHEN use_yn = 'Y'
             AND open_time IS NOT NULL
             AND close_time IS NOT NULL
             AND (
                (open_time <= close_time AND TIME(NOW()) BETWEEN open_time AND close_time)
                OR
                (open_time > close_time AND (TIME(NOW()) >= open_time OR TIME(NOW()) <= close_time))
             )
            THEN '영업중'
            ELSE '영업종료'
        END AS openLabel

    FROM BRANCH
    WHERE branch_id = #{branchId}
    LIMIT 1
""")
    BranchZoneDetailDto findForZoneDetail(@Param("branchId") long branchId);


    /**
     * ✅ 지도/검색/마커용: 지점 포인트 전체
     * - deleted_at 컬럼이 없다면 WHERE 줄은 제거해도 됨
     */
    @Select("""
        SELECT
            branch_id      AS branchId,
            branch_name    AS branchName,
            address_basic  AS addressBasic,
            CAST(latitude  AS DOUBLE) AS latitude,
            CAST(longitude AS DOUBLE) AS longitude
        FROM BRANCH
        WHERE deleted_at IS NULL
        ORDER BY branch_id ASC
    """)
    List<BranchMapDto> findForMap();
}

