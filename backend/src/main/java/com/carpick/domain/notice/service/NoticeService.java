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

    /**
     * ✅ 유저용: 조회수 증가와 상세 조회를 하나의 트랜잭션으로 처리 (버그 수정 핵심)
     */
    @Transactional
    public Optional<NoticeNtt> getNoticeWithUpdateViews(Long id) {
        // 1. DB에서 직접 조회수 +1 업데이트
        int updatedCount = noticeRepository.incrementViewCount(id);
        
        // 2. 업데이트 성공 시 데이터를 조회하여 반환
        if (updatedCount > 0) {
            return noticeRepository.findByIdAndDeletedFalse(id);
        }
        return Optional.empty();
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
                }).orElse(false);
    }
}