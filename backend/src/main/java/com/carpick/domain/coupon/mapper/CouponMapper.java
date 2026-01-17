package com.carpick.domain.coupon.mapper;

import com.carpick.domain.coupon.entity.Coupon;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CouponMapper {
    Coupon findByCouponCode(@Param("couponCode") String couponCode);

    int incrementUsedQuantity(@Param("couponCode") String couponCode);

    Coupon findById(@Param("couponId") Long couponId);
}
