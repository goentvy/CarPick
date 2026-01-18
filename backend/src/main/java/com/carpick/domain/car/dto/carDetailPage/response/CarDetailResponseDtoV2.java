package com.carpick.domain.car.dto.carDetailPage.response;


import com.carpick.domain.car.dto.review.ReviewSection;
import com.carpick.domain.car.enums.CarClass;
import lombok.Builder;
import lombok.Data;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@Setter
public class CarDetailResponseDtoV2 {
    private Long specId;
    private String aiSummary;
    private String carOptions;
    private TopCarDetail topCarDetailDto;
    private CarCardSection carCardSectionDto;
    private Location locationDto;
    private ReviewSection reviewSection;

    // === Inner Classes ===

    @Data @Builder
    public static class TopCarDetail {
        private String title;
        private String subtitle;
        private String mainVideoUrl; // ⭐ 메인 스핀 mp4 URL
        private CarClass carType;
    }

    @Data @Builder
    public static class CarCardSection {
        private List<CarCard> cards;
    }

    @Data @Builder
    public static class CarCard {
        private String type;
        private String title;
        private String value;
        private String unit;
        private String icon;
    }

    @Data @Builder
    public static class Location {
        private Branch pickup;

    }

    @Data @Builder
    public static class Branch {
        private Long branchId;
        private String branchName;
        private String address;
        private Double latitude;
        private Double longitude;
    }



}
