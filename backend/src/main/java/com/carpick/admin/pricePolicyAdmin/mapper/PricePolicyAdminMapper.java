package com.carpick.admin.pricePolicyAdmin.mapper;


import com.carpick.admin.pricePolicyAdmin.dto.PricePolicyRowDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PricePolicyAdminMapper {
    /* =========================
     * 조회
     * ========================= */

    /**
     * 가격 정책 목록 조회
     * - 지점 + 가격단위(단기/장기) 기준
     * - 관리자 표(table) 출력용
     */
    List<PricePolicyRowDto> findAllByBranchAndPriceType(
            @Param("branchId") Long branchId,
            @Param("priceType") String priceType
    );

    /**
     * 단건 조회 (수정 후 재조회용)
     */
    PricePolicyRowDto findById(@Param("pricePolicyId") Long pricePolicyId);


    /* =========================
     * 생성 / 수정
     * ========================= */

    /**
     * 가격 정책 신규 등록
     * - pricePolicyId는 AUTO_INCREMENT
     */
    int insert(PricePolicyRowDto dto);

    /**
     * 가격 정책 인라인 수정
     * - 관리자 테이블에서 바로 수정
     */
    int update(PricePolicyRowDto dto);


    /* =========================
     * 상태 변경
     * ========================= */

    /**
     * 가격 정책 활성/비활성 토글
     */
    int updateActiveStatus(
            @Param("pricePolicyId") Long pricePolicyId,
            @Param("isActive") Boolean isActive
    );

    /**
     * 사용 여부 변경 (Y/N)
     */
    int updateUseYn(
            @Param("pricePolicyId") Long pricePolicyId,
            @Param("useYn") String useYn
    );


    /* =========================
     * 배타 적용 처리
     * ========================= */

    /**
     * [지점 전체 적용 ON]
     * - 같은 지점 + 가격단위의 차종별 정책 비활성화
     */
    int deactivateSpecPolicies(
            @Param("branchId") Long branchId,
            @Param("priceType") String priceType
    );

    /**
     * [차종별 적용 ON]
     * - 같은 지점 + 가격단위의 지점 전체 정책 비활성화
     */
    int deactivateBranchWidePolicies(
            @Param("branchId") Long branchId,
            @Param("priceType") String priceType
    );

    /**
     * 정책 단건 조회 (고유 키 기준)
     * - branchId + priceType + specId(NULL 가능)
     */
    PricePolicyRowDto findByKey(
            @Param("branchId") Long branchId,
            @Param("priceType") String priceType,
            @Param("specId") Long specId
    );

    /**
     * 기본값으로 신규 정책 생성 (자동 보강용)
     * - 화면에서는 직접 호출하지 않음
     */
    int insertDefault(
            @Param("branchId") Long branchId,
            @Param("priceType") String priceType,
            @Param("specId") Long specId
    );

    /* =========================
     * 삭제
     * ========================= */

    /**
     * 논리 삭제
     */
    int softDelete(@Param("pricePolicyId") Long pricePolicyId);


}
