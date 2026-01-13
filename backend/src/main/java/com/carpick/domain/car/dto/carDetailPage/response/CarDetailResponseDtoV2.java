package com.carpick.domain.car.dto.carDetailPage.response;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CarDetailResponseDtoV2 {
    private Long specId;
    private TopCarDetail topCarDetailDto;
    private CarCardSection carCardSectionDto;
    private Location locationDto;


    // === Inner Classes ===

    @Data @Builder
    public static class TopCarDetail {
        private String title;
        private String subtitle;
        private List<String> imageUrls;
        private String carType;
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
