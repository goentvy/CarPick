// com/carpick/domain/member/dto/LicenseDto.java
package com.carpick.domain.member.dto;

import com.carpick.domain.member.entity.DriverLicense;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LicenseDto {
    private Long id;
    private Long userId;
    private String driverName;
    private String birthday;
    private String licenseNumber;
    private String serialNumber;
    private String createdAt;
    private String updatedAt;

    public static LicenseDto fromEntity(DriverLicense entity) {
        LicenseDto dto = new LicenseDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setDriverName(entity.getDriverName());
        dto.setBirthday(entity.getBirthday().toString());
        dto.setLicenseNumber(entity.getLicenseNumber());
        dto.setSerialNumber(entity.getSerialNumber());
        dto.setCreatedAt(entity.getCreatedAt().toString());
        dto.setUpdatedAt(entity.getUpdatedAt().toString());
        return dto;
    }
}
