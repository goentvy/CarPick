// com/carpick/domain/member/dto/LicenseRegisterDto.java
package com.carpick.domain.member.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


@Getter @Setter
public class LicenseRegisterDto {
    @NotBlank(message = "성명은 필수입니다")
    @Size(min = 2, max = 50, message = "성명은 2~50자입니다")
    private String driverName;

    @NotNull(message = "생년월일은 필수입니다")
    @Past(message = "생년월일은 과거 날짜여야 합니다")
    private LocalDate birthday;

    @NotBlank(message = "면허번호는 필수입니다")
    @Pattern(regexp = "^\\d{2}-?\\d{2}-?\\d{6}-?\\d{2}$|^\\d{12}$",  // ✅ 하이픈 유무 모두 허용
            message = "면허번호 형식(12자리)을 확인하세요")
    private String licenseNumber;

    @NotBlank(message = "일련번호는 필수입니다")
    @Size(min = 6, max = 10, message = "일련번호는 6~10자입니다")
    private String serialNumber;
}