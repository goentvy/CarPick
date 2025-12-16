package com.carpick.service;


import com.carpick.ntt.NoticeNtt;
import com.carpick.repository.NoticeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;


    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }


    public List<NoticeNtt> getAllNotices() {
        return noticeRepository.findByDeletedFalseOrderByCreatedAtDesc();
    }


    public Optional<NoticeNtt> getNotice(Long id) {
        return noticeRepository.findById(id)
                .filter(n -> !n.isDeleted());
    }


    public Optional<NoticeNtt> getLatestNotice() {
        List<NoticeNtt> list = noticeRepository.findByDeletedFalseOrderByCreatedAtDesc();
        if (list.isEmpty()) return Optional.empty();
        return Optional.of(list.get(0));
    }


    @Transactional
    public NoticeNtt createNotice(String title, String content) {
        NoticeNtt n = new NoticeNtt();
        n.setTitle(title);
        n.setContent(content);
        n.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(n);
    }


    @Transactional
    public Optional<NoticeNtt> updateNotice(Long id, String title, String content) {
        return noticeRepository.findById(id).map(n -> {
            if (n.isDeleted()) return n;
            n.setTitle(title);
            n.setContent(content);
            n.setUpdatedAt(LocalDateTime.now());
            return noticeRepository.save(n);
        });
    }


    @Transactional
    public boolean softDeleteNotice(Long id) {
        return noticeRepository.findById(id).map(n -> {
            if (n.isDeleted()) return false;
            n.setDeleted(true);
            n.setUpdatedAt(LocalDateTime.now());
            noticeRepository.save(n);
            return true;
        }).orElse(false);
    }
}