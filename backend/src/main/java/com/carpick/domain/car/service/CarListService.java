package com.carpick.domain.car.service;


import com.carpick.domain.car.dto.carListPage.CarListItemDto;
import com.carpick.domain.car.mapper.CarMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarListService {
    private final CarMapper carMapper;

    /**
     * 차량 목록 조회 (차종 기준)
     *
     * - UI에는 차종 카드만 노출
     * - 실차(vehicle)는 예약 가능 여부 판단용 근거
     * - 할인/원가는 표시용(optional)
     * - 최종 결제 기준 금액은 finalPrice
     */
    public List<CarListItemDto> getCarListItems() {

        List<CarListItemDto> items = carMapper.selectCarListItems();

        // 👉 Service 레벨에서 "의미 보정"만 수행
        // (비즈니스 판단 ❌, 계산 중복 ❌)

        for (CarListItemDto item : items) {

            // finalPrice가 없으면 원가로 fallback (방어)
            if (item.getFinalPrice() == null && item.getOriginalPrice() != null) {
                item.setFinalPrice(item.getOriginalPrice());
            }

            // 할인율이 0이면 null 처리 (표시용 의미 분리)
            if (item.getDiscountRate() != null && item.getDiscountRate() == 0) {
                item.setDiscountRate(null);
            }
        }

        return items;
    }

}
