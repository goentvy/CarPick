package com.carpick.domain.car.dto.response.common;


import lombok.Data;

@Data
public class BranchLocationDto {
    private Long branchId;
    private String branchName;
    private String address;
    private Long latitude;
    private Long longitude;
}
