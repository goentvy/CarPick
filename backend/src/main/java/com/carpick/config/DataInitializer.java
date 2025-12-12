package com.example.config;

import com.example.domain.Admin;
import com.example.domain.NoticeNtt;
import com.example.repository.AdminRepository;
import com.example.repository.NoticeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final AdminRepository adminRepository;
    private final NoticeRepository noticeRepository;
    
    public DataInitializer(AdminRepository adminRepository, NoticeRepository noticeRepository) {
        this.adminRepository = adminRepository;
        this.noticeRepository = noticeRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // 기본 관리자 계정이 없으면 생성 (admin_user 테이블)
        if (adminRepository.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("1234");
            adminRepository.save(admin);
            System.out.println("기본 관리자 계정 생성됨 (admin_user 테이블): admin/1234");
        }
    }
}