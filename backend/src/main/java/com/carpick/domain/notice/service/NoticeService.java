package com.carpick.domain.notice.service;

import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.repository.NoticeRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    /**
     * ✅ 검색 + 페이징 (관리자)
     */
    public Page<NoticeNtt> searchNotices(String keyword, PageRequest pageable) {

        // keyword가 없으면 전체 조회
        if (keyword == null || keyword.trim().isEmpty()) {
            return noticeRepository.findByDeletedFalseOrderByCreatedAtDesc(pageable);
        }

        // keyword 있으면 제목 + 내용 검색
        return noticeRepository.searchAdmin(keyword, pageable);
    }

    /**
     * ✅ 단건 조회
     */
    public Optional<NoticeNtt> getNotice(Long id) {
        return noticeRepository.findById(id)
                .filter(n -> !n.isDeleted());
    }

    /**
     * ✅ 등록 / 수정
     */
    @Transactional
    public void save(NoticeNtt notice) {

        if (notice.getId() == null) {
            notice.setCreatedAt(LocalDateTime.now());
            noticeRepository.save(notice);
            return;
        }

        NoticeNtt origin = noticeRepository.findById(notice.getId())
                .orElseThrow(() -> new IllegalArgumentException("공지사항 없음"));

        origin.setTitle(notice.getTitle());
        origin.setContent(notice.getContent());
        origin.setCategory(notice.getCategory());
        origin.setUpdatedAt(LocalDateTime.now());

        noticeRepository.save(origin);
    }

    /**
     * 🗑 Soft Delete
     */
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
