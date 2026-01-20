package com.carpick.domain.price.discount;

import com.carpick.domain.coupon.entity.Coupon;
import com.carpick.domain.coupon.mapper.CouponMapper;
import com.carpick.domain.price.entity.PricePolicy;
import com.carpick.domain.price.enums.PriceType;
import com.carpick.domain.price.mapper.PricePolicyMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiscountPolicyService {
    private final PricePolicyMapper pricePolicyMapper;
    private final CouponMapper couponMapper;

    // [변경] PriceType을 인자로 받도록 수정!
    public PricePolicy findDiscountPolicy(Long specId, Long branchId, PriceType priceType) {
        return pricePolicyMapper.findBySpecIdAndPriceType(specId, branchId, priceType);
    }

    public int getDiscountRate(PricePolicy policy) {
        if (policy == null || !policy.getIsActive() || "N".equals(policy.getUseYn())) return 0;
        return policy.getDiscountRate();
    }

    /**
     * [쿠폰 할인 계산] - Enum 적용 버전
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateCouponDiscountAmount(String couponCode, BigDecimal currentTotalAmount) {
        // 1. 코드 검증
        if (couponCode == null || couponCode.isBlank()) {
            return BigDecimal.ZERO;
        }

        // 2. DB 조회
        Coupon coupon = couponMapper.findByCouponCode(couponCode);
        if (coupon == null) {
            log.warn("존재하지 않는 쿠폰 코드: {}", couponCode);
            return BigDecimal.ZERO;
        }

        // 3. 유효성 체크
        if (!isValidCoupon(coupon, currentTotalAmount)) {
            return BigDecimal.ZERO;
        }

        // 4. [수정됨] Enum을 활용한 깔끔한 계산 로직 (Switch 사용)
        BigDecimal discountAmount = BigDecimal.ZERO;

        switch (coupon.getCouponType()) {
            case FIXED: // 정액 할인
                // 예: 5,000원 할인
                discountAmount = BigDecimal.valueOf(coupon.getDiscountValue());
                break;

            case RATE: // 정률 할인
                // 예: 10% 할인 (금액 * 값 / 100)
                BigDecimal rate = BigDecimal.valueOf(coupon.getDiscountValue());
                discountAmount = currentTotalAmount.multiply(rate)
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);


                // 최대 할인 한도 체크 (정률일 때만)
                if (coupon.getMaxDiscountAmount() != null && coupon.getMaxDiscountAmount() > 0) {
                    BigDecimal maxLimit = BigDecimal.valueOf(coupon.getMaxDiscountAmount());
                    if (discountAmount.compareTo(maxLimit) > 0) {
                        discountAmount = maxLimit;
                    }
                }
                break;

            default:
                log.warn("알 수 없는 쿠폰 타입: {}", coupon.getCouponType());
                return BigDecimal.ZERO;
        }

        // 5. 배보다 배꼽이 더 큰 경우 방어
        if (discountAmount.compareTo(currentTotalAmount) > 0) {
            return currentTotalAmount;
        }

        return discountAmount;
    }

    // 유효성 검사 로직 (동일)
    private boolean isValidCoupon(Coupon coupon, BigDecimal orderAmount) {
        LocalDateTime now = LocalDateTime.now();

        if (!Boolean.TRUE.equals(coupon.getIsActive())) return false; // Null Safe
        if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidTo())) return false;

        if (coupon.getMinOrderAmount() != null) {
            if (orderAmount.compareTo(BigDecimal.valueOf(coupon.getMinOrderAmount())) < 0) {
                return false;
            }
        }


        // 수량 체크
        if (coupon.getTotalQuantity() != null && coupon.getUsedQuantity() >= coupon.getTotalQuantity()) {
            return false;
        }

        return true;
    }
}
