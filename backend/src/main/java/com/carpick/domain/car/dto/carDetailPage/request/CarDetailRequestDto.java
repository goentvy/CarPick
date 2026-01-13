package com.carpick.domain.car.dto.carDetailPage.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CarDetailRequestDto {
    @NotNull(message = "specId는 필수입니다")
    @Positive(message = "specId는 양수여야 합니다")
    private Long specId;

    @NotNull(message = "pickupBranchId는 필수입니다")
    @Positive(message = "pickupBranchId는 양수여야 합니다")
    private Long pickupBranchId;

}
