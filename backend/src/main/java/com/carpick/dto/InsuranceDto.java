package com.carpick.dto;

import lombok.Data;

@Data
public class InsuranceDto {
    private Long insuranceId;
    private String insuranceName;
    private String coverageDetails;
    private Integer dailyPremium;


}
