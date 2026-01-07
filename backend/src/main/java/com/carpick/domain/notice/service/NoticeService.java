package com.carpick.domain.notice.service;

import com.carpick.domain.notice.dto.NoticeDto;
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
     * ✅ 유저용: 조회수 증가와 상세 조회를 하나의 트랜잭션으로 처리
     */
    @Transactional
    public Optional<NoticeDto> getNoticeWithUpdateViews(Long id) {
        // 1. 조회수 증가
        int updatedCount = noticeRepository.incrementViewCount(id);
        
        // 2. 업데이트 성공 시 데이터를 조회하여 DTO로 변환
        if (updatedCount > 0) {
            return noticeRepository.findByIdAndDeletedFalse(id).map(notice -> {
                // Entity -> Dto 변환 (조회수 views 포함)
                NoticeDto dto = new NoticeDto(
                    notice.getId(), 
                    notice.getTitle(), 
                    notice.getContent(), 
                    notice.getCreatedAt(), 
                    notice.getUpdatedAt(),
                    notice.getViews() // NoticeNtt에 views가 있으므로 추가
                );

                // 이전글/다음글 정보 세팅
                var prevEntity = noticeRepository.findTop1ByDeletedFalseAndCreatedAtLessThanOrderByCreatedAtDesc(notice.getCreatedAt());
                var nextEntity = noticeRepository.findTop1ByDeletedFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(notice.getCreatedAt());

                if (prevEntity != null) {
                    dto.setPrev(new NoticeDto.NavInfo(prevEntity.getId(), prevEntity.getTitle()));
                }
                if (nextEntity != null) {
                    dto.setNext(new NoticeDto.NavInfo(nextEntity.getId(), nextEntity.getTitle()));
                }

                return dto;
            });
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