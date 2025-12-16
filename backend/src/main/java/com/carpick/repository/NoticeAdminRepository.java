package com.carpick.repository;

import com.carpick.ntt.AdminNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NoticeAdminRepository extends JpaRepository<AdminNotice, Long> {
    Optional<AdminNotice> findByUsername(String username);
}