package com.carpick.domain.notice.service;

import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.repository.NoticeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional(readOnly = true)
    public Page<NoticeNtt> searchNotices(String keyword, Pageable pageable) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return noticeRepository
                    .findByDeletedFalseOrderByCreatedAtDesc(pageable);
        }

        return noticeRepository.searchAdmin(keyword, pageable);
    }

    /**
     * ✅ 단건 조회 (삭제 제외)
     */
    @Transactional(readOnly = true)
    public Optional<NoticeNtt> getNotice(Long id) {
        return noticeRepository.findById(id)
                .filter(n -> Boolean.FALSE.equals(n.getDeleted()));
    }

    /**
     * ✅ 등록 / 수정
     */
    @Transactional
    public NoticeNtt save(NoticeNtt notice) {

        // 신규 등록
        if (notice.getId() == null) {
            notice.setDeleted(false);
            notice.setViews(0L);
            return noticeRepository.save(notice);
        }

        // 수정
        NoticeNtt origin = noticeRepository.findById(notice.getId())
                .orElseThrow(() -> new IllegalArgumentException("공지사항 없음"));

        origin.setTitle(notice.getTitle());
        origin.setContent(notice.getContent());
        origin.setCategory(notice.getCategory());

        // 날짜는 DB에서 자동 처리
        return noticeRepository.save(origin);
    }

    /**
     * 🗑 Soft Delete
     */
    @Transactional
    public boolean softDeleteNotice(Long id) {
        return noticeRepository.findById(id).map(n -> {
            if (Boolean.TRUE.equals(n.getDeleted())) return false;
            n.setDeleted(true);
            return true;
        }).orElse(false);
    }
}
