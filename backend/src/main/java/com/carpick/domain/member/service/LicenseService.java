// com/carpick/domain/member/service/LicenseService.java
package com.carpick.domain.member.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.member.dto.LicenseDto;
import com.carpick.domain.member.dto.LicenseRegisterDto;
import com.carpick.domain.member.entity.DriverLicense;
import com.carpick.domain.member.repository.DriverLicenseRepository;

import lombok.RequiredArgsConstructor;

// com.carpick.domain.member.service.LicenseService.java
@Service
@RequiredArgsConstructor
@Transactional
public class LicenseService {
    private final DriverLicenseRepository repository;

    // ✅ 다중 면허 등록 허용
    public LicenseDto register(Long userId, LicenseRegisterDto dto) {
        // 1인1면허 제한 제거!
        // if (repository.existsByUserId(userId)) { ... }

        String cleanLicense = dto.getLicenseNumber().replaceAll("-", "");
        if (!cleanLicense.matches("\\d{12}")) {
            throw new IllegalArgumentException("면허번호는 12자리 숫자여야 합니다.");
        }

        DriverLicense license = DriverLicense.builder()
                .userId(userId)
                .driverName(dto.getDriverName())
                .birthday(dto.getBirthday())
                .licenseNumber(cleanLicense)
                .serialNumber(dto.getSerialNumber().toUpperCase())
                .build();

        DriverLicense saved = repository.save(license);
        return LicenseDto.fromEntity(saved);
    }

    // ✅ 내 모든 면허 조회 (List 반환)
    public List<LicenseDto> getMyLicenses(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(LicenseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public LicenseDto update(Long licenseId, LicenseRegisterDto dto) {
        DriverLicense license = repository.findById(licenseId)
                .orElseThrow(() -> new IllegalStateException("해당 면허 정보가 없습니다."));

        license.setDriverName(dto.getDriverName());
        license.setBirthday(dto.getBirthday());
        license.setLicenseNumber(dto.getLicenseNumber().replaceAll("-", ""));
        license.setSerialNumber(dto.getSerialNumber().toUpperCase());

        return LicenseDto.fromEntity(repository.save(license));
    }

    public void delete(Long licenseId) {
        repository.deleteById(licenseId);
    }
}
