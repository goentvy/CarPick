package com.carpick.service;

import com.carpick.ntt.AdminNotice;
import com.carpick.repository.NoticeAdminRepository;
import org.springframework.stereotype.Service;

@Service
public class NoticeAdminLoginService {
    private final NoticeAdminRepository noticeAdminRepository;

    public NoticeAdminLoginService(NoticeAdminRepository noticeAdminRepository) {
        this.noticeAdminRepository = noticeAdminRepository;
    }

    public boolean validateAdmin(String username, String password) {
        return noticeAdminRepository.findByUsername(username)
                .map(admin -> admin.getPassword().equals(password))
                .orElse(false);
    }
}