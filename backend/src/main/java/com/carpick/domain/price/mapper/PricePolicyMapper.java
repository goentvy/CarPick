package com.carpick.domain.price.mapper;

import com.carpick.domain.price.entity.PricePolicy;
import com.carpick.domain.price.enums.PriceType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PricePolicyMapper {
    // 차종 + 가격타입으로 정책 조회 (지점 우선, 없으면 전국)
    /**
     * [역할]
     *  - PRICE_POLICY 테이블 조회 전용 Mapper
     *  - 정가(base_price)와 기본 할인율(discount_rate)을 결정하는 "가격 정책"을 조회한다.
     *
     * [정책 선택 규칙]
     *  1. 차종(specId)과 가격 단위(priceType)가 일치해야 한다.
     *  2. 지점(branchId) 정책이 있으면 우선 적용한다.
     *  3. 지점 정책이 없으면 전국 공통(branch_id IS NULL) 정책을 적용한다.
     *  4. 적용 기간(valid_from ~ valid_to)이 현재 시점에 유효해야 한다.
     *  5. 여러 정책이 있으면 가장 최신(valid_from DESC) 정책 1개를 선택한다.
     *
     * [의미]
     *  - "보여줄 정가"와 "기본 할인율"을 제공한다.
     *  - 실제 판매가(PRICE)와 분리된 '운영 정책' 영역이다.
     *
     * [사용 위치]
     *  - PriceCalculatorService 내부에서 호출
     *
     * [주의]
     *  - 최종 금액 계산은 이 Mapper에서 하지 않는다.
     *  - 할인 중첩, 이벤트/쿠폰 할인은 여기서 다루지 않는다(MVP 범위 밖).
     *
     * @param specId   차량 스펙 ID
     * @param branchId 지점 ID (지점 우선 정책 조회용)
     * @param priceType 가격 단위 (DAILY / MONTHLY)
     * @return PricePolicy 적용 가능한 기본 가격 정책 1건
     */


    PricePolicy findBySpecIdAndPriceType(
            @Param("specId") Long specId,
            @Param("branchId") Long branchId,
            @Param("priceType") PriceType priceType
    );
}
