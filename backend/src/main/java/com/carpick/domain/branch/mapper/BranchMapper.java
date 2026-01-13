package com.carpick.domain.branch.mapper;

import com.carpick.domain.branch.dto.BranchHomeDto;
import com.carpick.domain.branch.dto.BranchZoneDetailDto;
import com.carpick.domain.branch.dto.BranchMapDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * BranchMapper (MyBatis Annotation 기반)
 * - XML 없이 @Select로만 구성
 */
@Mapper
public interface BranchMapper {

    /**
     * 홈/검색 지점 리스트
     * - 가벼운 필드만
     */
    List<BranchHomeDto> findForHome();

    /**
     * 카픽존 상세보기용 1건 조회
     */
    BranchZoneDetailDto findForZoneDetail(@Param("branchId") long branchId);


    /**
     * 지도/검색/마커용: 지점 포인트 전체
     */
    List<BranchMapDto> findForMap();
}

