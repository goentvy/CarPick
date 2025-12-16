package com.carpick.config;

import com.carpick.ntt.AdminNotice;
import com.carpick.repository.NoticeAdminRepository;
import com.carpick.repository.NoticeRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final NoticeAdminRepository noticeAdminRepository;
    private final NoticeRepository noticeRepository;
    
    public DataInitializer(NoticeAdminRepository noticeAdminRepository, NoticeRepository noticeRepository) {
        this.noticeAdminRepository = noticeAdminRepository;
        this.noticeRepository = noticeRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // 기본 관리자 계정이 없으면 생성 (admin_user 테이블)
        if (noticeAdminRepository.findByUsername("admin").isEmpty()) {
            AdminNotice admin = new AdminNotice();
            admin.setUsername("admin");
            admin.setPassword("1234");
            noticeAdminRepository.save(admin);
            System.out.println("기본 관리자 계정 생성됨 (admin_user 테이블): admin/1234");
        }
    }
}