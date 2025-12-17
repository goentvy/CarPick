// com.carpick.domain.member.repository.DriverLicenseRepository.java
package com.carpick.domain.member.repository;

import com.carpick.domain.member.entity.DriverLicense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriverLicenseRepository extends JpaRepository<DriverLicense, Long> {
    List<DriverLicense> findByUserId(Long userId);
}