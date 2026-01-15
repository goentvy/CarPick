package com.carpick.domain.car.service;


import com.carpick.domain.car.dto.carDetailPage.response.CarDetailResponseDtoV2;
import com.carpick.domain.car.dto.raw.CarDetailRawDto;
import com.carpick.domain.car.enums.CardType;
import com.carpick.domain.car.enums.FuelType;
import com.carpick.domain.car.mapper.CarMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.car.dto.carDetailPage.response.CarDetailResponseDtoV2.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarDetailServiceV2 {
    private final CarMapper carMapper;

    /**
     * 차량 상세 V2
     * - spec 중심
     * - pickupBranch 컨텍스트
     * - 가격 제외
     */
    @Transactional(readOnly = true)
    public CarDetailResponseDtoV2 getCarDetail(Long specId, Long pickupBranchId) {
        CarDetailRawDto raw = carMapper.selectCarDetailV2(specId, pickupBranchId);

        if (raw == null) {
            throw new IllegalArgumentException(
                    "차량 정보를 찾을 수 없습니다. specId=" + specId + ", pickupBranchId=" + pickupBranchId
            );
        }

        return CarDetailResponseDtoV2.builder()
                .specId(raw.getSpecId())
                .aiSummary(raw.getAiSummary())
                .carOptions(raw.getCarOptions())
                .topCarDetailDto(buildTopCarDetail(raw))
                .carCardSectionDto(buildCarCardSection(raw))
                .locationDto(buildLocation(raw))
                .build();
    }

    /* =========================
       Top 영역
       ========================= */

    private CarDetailResponseDtoV2.TopCarDetail buildTopCarDetail(CarDetailRawDto raw) {
        List<String> imageUrls = new ArrayList<>();
        if (hasText(raw.getMainImageUrl())) {
            imageUrls.add(raw.getMainImageUrl().trim());
        }

        return CarDetailResponseDtoV2.TopCarDetail.builder()
                .title(raw.getModelName())
                .subtitle(buildSubtitle(raw))
                .imageUrls(imageUrls)
                .carType(raw.getCarClass()) // CarClass enum 그대로
                .build();
    }

    private String buildSubtitle(CarDetailRawDto raw) {
        String year = raw.getModelYearBase() == null ? "-" : raw.getModelYearBase() + "년형";
        String seats = raw.getSeatingCapacity() == null ? "-" : raw.getSeatingCapacity() + "인승";
        String fuel = fuelDesc(raw.getFuelType());
        if (fuel == null) fuel = "-";

        return year + " · " + seats + " · " + fuel;
    }

    /* =========================
       카드 영역 (CardType enum 사용)
       ========================= */

    private CarDetailResponseDtoV2.CarCardSection buildCarCardSection(CarDetailRawDto raw) {
        List<CarDetailResponseDtoV2.CarCard> cards = new ArrayList<>();

        add(cards, card(CardType.FUEL, fuelDesc(raw.getFuelType())));
        add(cards, card(CardType.YEAR, toStr(raw.getModelYearBase())));
        add(cards, card(CardType.SEATS, toStr(raw.getSeatingCapacity())));
        add(cards, card(CardType.CAREER, toStr(raw.getMinLicenseYears())));
        add(cards, card(CardType.AGE, toStr(raw.getMinDriverAge())));
        add(cards, card(CardType.FUEL_EFF, normalizeNumber(raw.getFuelEfficiency())));

        return CarDetailResponseDtoV2.CarCardSection.builder()
                .cards(cards)
                .build();
    }

    private CarDetailResponseDtoV2.CarCard card(CardType type, String value) {
        if (!hasText(value)) return null;

        return CarDetailResponseDtoV2.CarCard.builder()
                .type(type.name())        // 프런트 분기용
                .title(type.getTitle())
                .value(value)
                .unit(type.getUnit())
                .icon(type.getIcon())
                .build();
    }

    /* =========================
       지점 영역 (A안)
       ========================= */

    private Location buildLocation(CarDetailRawDto raw) {
        CarDetailResponseDtoV2.Branch pickup = CarDetailResponseDtoV2.Branch.builder()
                .branchId(raw.getBranchId())
                .branchName(raw.getBranchName())
                .address(raw.getAddressBasic())
                .latitude(toDouble(raw.getLatitude()))
                .longitude(toDouble(raw.getLongitude()))
                .build();

        return Location.builder()
                .pickup(pickup)
                .build();
    }

    /* =========================
       Helpers (null-safe)
       ========================= */

    private void add(List<CarDetailResponseDtoV2.CarCard> cards, CarDetailResponseDtoV2.CarCard card) {
        if (card != null) {
            cards.add(card);
        }
    }

    private String fuelDesc(FuelType fuelType) {
        return fuelType == null ? null : fuelType.getDescription();
    }

    private String toStr(Object o) {
        return o == null ? null : String.valueOf(o);
    }

    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }

    private String normalizeNumber(Object v) {
        if (v == null) return null;

        if (v instanceof BigDecimal bd) {
            return bd.stripTrailingZeros().toPlainString();
        }
        if (v instanceof Double d) {
            if (d.isNaN() || d.isInfinite()) return null;
            long l = d.longValue();
            return (d == l) ? String.valueOf(l) : String.valueOf(d);
        }
        if (v instanceof Integer || v instanceof Long) {
            return String.valueOf(v);
        }

        String s = String.valueOf(v).trim();
        return s.isBlank() ? null : s;
    }

    private Double toDouble(Object v) {
        if (v == null) return null;
        if (v instanceof Double d) return d;
        if (v instanceof BigDecimal bd) return bd.doubleValue();
        if (v instanceof Integer i) return i.doubleValue();
        if (v instanceof Long l) return l.doubleValue();
        try {
            return Double.parseDouble(String.valueOf(v));
        } catch (Exception e) {
            return null;
        }
    }

}
