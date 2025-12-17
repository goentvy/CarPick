package com.carpick.domain.car.dto.response.common;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class BranchLocationDto {
    private Long branchId;
    private String branchName;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
