package com.carpick.domain.rent.dto;

import lombok.AllArgsConstructor; // 추가
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor; // 추가
import java.util.List;

@Getter
@Builder
@NoArgsConstructor // 추가
@AllArgsConstructor // 추가
public class RentYearResponse {
    private List<DetailItem> conditions;
    private List<DetailItem> insurance;
    private List<DetailItem> maintenance;

    @Getter
    @Builder
    @NoArgsConstructor // 추가
    @AllArgsConstructor // 추가
    public static class DetailItem {
        private String label;
        private String value;
        private String icon;
    }
}