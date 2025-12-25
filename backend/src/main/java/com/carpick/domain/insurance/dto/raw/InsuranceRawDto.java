package com.carpick.domain.insurance.dto.raw;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class InsuranceRawDto {
    private Long insuranceId;           // insurance_id
    private String code;                // code (NONE/STANDARD/FULL)
    private String label;               // label (선택안함/일반자차/완전자차)
    private String summaryLabel;        // summary_label
    private BigDecimal extraDailyPrice; // extra_daily_price
    private Boolean isDefault;          // is_default
    private Integer sortOrder;          // sort_order


}
