package com.carpick.domain.price.mapper;

import com.carpick.domain.price.entity.Price;
import com.carpick.domain.price.enums.PriceType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;

@Mapper
public interface PriceMapper {


    /**
     * [역할]
     *  - PRICE 테이블 조회 전용 Mapper
     *  - "이 차종을 실제로 얼마에 빌려주고 있는가?"를 조회한다.
     *
     * [의미]
     *  - daily_price / monthly_price 등 '실제 판매가'를 제공한다.
     *  - 가격 계산의 기준이 되는 단가(Unit Price) 역할.
     *
     *
     * [주의]
     *  - 할인, 정책, 기간 개념은 여기서 다루지 않는다.
     *  - 순수한 요금표(Price Table) 역할만 담당한다.
     *
     * @param specId 차량 스펙 ID
     * @return Price 판매가 정보 (일/월 단가 포함)
     */
    Price findBySpecId(@Param("specId") Long specId);
//예약 가격 계산에 쓰는 ‘진짜 단가’는 정책이 아니라 PRICE 테이블이기 때문
//    왜 PolicyReader 이름을 써도 되냐?
//    역할은 ‘단기 가격을 읽는다’이지, 할인 정책을 적용하는 게 아니기 때문

    BigDecimal selectActiveUnitPriceByPriceType(
            @Param("specId") Long specId,
            @Param("priceType") PriceType priceType
    );
}
