package com.carpick.domain.notice.service;

import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.repository.NoticeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @Transactional(readOnly = true)
    public Page<NoticeNtt> searchNotices(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return noticeRepository.findByDeletedFalseOrderByCreatedAtDesc(pageable);
        }
        return noticeRepository.search(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public Optional<NoticeNtt> getNotice(Long id) {
        return noticeRepository.findByIdAndDeletedFalse(id);
    }

    @Transactional(readOnly = true)
    public List<NoticeNtt> getAllNotices() {
        return noticeRepository.findByDeletedFalseOrderByCreatedAtDesc();
    }

    @Transactional
    public boolean incrementViewCount(Long id) {
        return noticeRepository.incrementViewCount(id) > 0;
    }

    @Transactional
    public NoticeNtt save(NoticeNtt notice) {
        if (notice.getId() == null) {
            notice.setDeleted(false);
            notice.setViews(0L);
            return noticeRepository.save(notice);
        }

        return noticeRepository.findById(notice.getId())
                .map(origin -> {
                    origin.setTitle(notice.getTitle());
                    origin.setContent(notice.getContent());
                    origin.setCategory(notice.getCategory());
                    return noticeRepository.save(origin);
                })
                .orElseThrow(() -> new IllegalArgumentException("공지사항 없음"));
    }

    @Transactional
    public boolean softDeleteNotice(Long id) {
        return noticeRepository.findByIdAndDeletedFalse(id)
                .map(n -> {
                    n.setDeleted(true);
                    return true;
                })
                .orElse(false);
    }
}
