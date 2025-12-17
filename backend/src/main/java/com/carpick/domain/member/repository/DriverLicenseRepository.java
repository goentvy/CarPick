// com.carpick.domain.member.repository.DriverLicenseRepository.java
package com.carpick.domain.member.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carpick.domain.member.entitiy.DriverLicense;

public interface DriverLicenseRepository extends JpaRepository<DriverLicense, Long> {
    List<DriverLicense> findByUserId(Long userId);
}