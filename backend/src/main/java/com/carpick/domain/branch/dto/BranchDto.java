package com.carpick.domain.branch.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BranchDto {
	
	// 지점 선택 드롭다운 / 상세 표시용
    private Long branchId;

    @NotBlank(message = "지점 코드는 필수입니다")
    @Size(max = 20, message = "지점 코드는 20자 이내여야 합니다")
    private String branchCode;

    @NotBlank(message = "지점명은 필수입니다")
    @Size(max = 50, message = "지점명은 50자 이내여야 합니다")
    private String branchName;

    @NotBlank(message = "기본 주소는 필수입니다")
    @Size(max = 200, message = "주소는 200자 이내여야 합니다")
    private String addressBasic;

    @NotBlank(message = "지점 전화번호는 필수입니다")
    @Pattern(
        regexp = "^0\\d{1,2}-?\\d{3,4}-?\\d{4}$",
        message = "전화번호 형식이 올바르지 않습니다"
    )
    private String phone;

    // 운영 시간 (형식만 검증)
    @Pattern(
        regexp = "^([01]\\d|2[0-3]):[0-5]\\d$",
        message = "운영 시작 시간 형식은 HH:mm 입니다"
    )
    private String openTime;

    @Pattern(
        regexp = "^([01]\\d|2[0-3]):[0-5]\\d$",
        message = "운영 종료 시간 형식은 HH:mm 입니다"
    )
    private String closeTime;

    // 활성화 여부 (null 허용 → 일괄 처리 고려)
    private Boolean isActive;

}
