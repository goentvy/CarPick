package com.carpick.admin.priceAdmin.mapper;

import com.carpick.admin.priceAdmin.dto.AdminPriceDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminPriceMapper {
    /**
     * [1] 전체 목록 조회
     * - 차종별로 단기/장기 원가와 할인율 정보를 조인하여 가져옵니다.
     * - 화면의 메인 리스트를 구성하는 데이터를 제공합니다.
     */
    List<AdminPriceDto> selectList();

    /**
     * [2] 단건 조회
     * - 특정 차종(carSpecId)에 대한 가격 정보를 상세히 조회합니다.
     * - 수정 후 데이터 검증이나 상세 페이지 이동 시 사용됩니다.
     */
    AdminPriceDto selectBySpecId(@Param("carSpecId") Long carSpecId);

    /**
     * [3] 기본 가격 정보 수정 (PRICE 테이블 전용)
     * - daily_price, price_1m, price_3m, price_6m 등 '원본 가격'을 업데이트합니다.
     * - 업데이트 대상은 dto 내부의 priceId를 기준으로 합니다.
     */
    int updatePrice(AdminPriceDto dto);

    /**
     * [4] 할인 정책 정보 수정 (PRICE_POLICY 테이블 전용)
     * - discount_rate(할인율)를 업데이트합니다.
     * - 업데이트 대상은 dto 내부의 pricePolicyId를 기준으로 합니다.
     * - 만약 해당 차종에 정책 데이터가 없다면 Service에서 Insert 처리가 필요할 수 있습니다.
     */
    int updateDiscountRate(AdminPriceDto dto);
// ==========================================
    // ⬇️ [추가] 신규 등록 (Insert) 메서드
    // ==========================================

    /** [5] 기본 가격 신규 등록 (Insert) */
    int insertPrice(AdminPriceDto dto);

    /** [6] 할인 정책 신규 등록 (Insert) */
    int insertPricePolicy(AdminPriceDto dto);


}
