package com.carpick.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationChangeRequestDto {

    @NotBlank
    private String actionType;

    @NotBlank
    private String oldStartDate;

    @NotBlank
    private String oldEndDate;

    @NotBlank
    private String oldCarName;

    @NotNull
    private Integer oldPrice;

    @NotBlank
    private String newStartDate;

    @NotBlank
    private String newEndDate;

    @NotNull
    private Long newCarId;

    @NotBlank
    private String newCarName;

    @NotNull
    private Integer newPrice;

    @NotNull
    private Integer priceDifference;

    @NotNull
    private Integer days;
}
