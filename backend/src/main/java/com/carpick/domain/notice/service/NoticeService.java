package com.carpick.domain.notice.service;

import com.carpick.domain.notice.dto.NoticeDto;
import com.carpick.domain.notice.ntt.NoticeNtt;
import com.carpick.domain.notice.repository.NoticeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    /**
     * ✅ 유저용: 조회수 증가와 상세 조회를 하나의 트랜잭션으로 처리
     */
    @Transactional
    public Optional<NoticeDto> getNoticeWithUpdateViews(Long id) {
        int updatedCount = noticeRepository.incrementViewCount(id);
        
        if (updatedCount > 0) {
            // [1] 최신 공지사항 3개의 ID 리스트를 미리 가져옴
            List<Long> latestIds = noticeRepository.findTop3ByDeletedFalseOrderByCreatedAtDesc()
                    .stream().map(NoticeNtt::getId).toList();

            return noticeRepository.findByIdAndDeletedFalse(id).map(notice -> {
                NoticeDto dto = new NoticeDto(
                    notice.getId(), 
                    notice.getTitle(), 
                    notice.getContent(), 
                    notice.getCreatedAt(), 
                    notice.getUpdatedAt(),
                    notice.getViews()
                );

                // [2] 본문 글의 isNew 설정
                dto.setNew(latestIds.contains(notice.getId()));

                var prevEntity = noticeRepository.findTop1ByDeletedFalseAndCreatedAtLessThanOrderByCreatedAtDesc(notice.getCreatedAt());
                var nextEntity = noticeRepository.findTop1ByDeletedFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(notice.getCreatedAt());

                // [3] ✅ 수정: 이전글/다음글도 latestIds 포함 여부를 확인하여 전달
                if (prevEntity != null) {
                    dto.setPrev(new NoticeDto.NavInfo(
                        prevEntity.getId(), 
                        prevEntity.getTitle(), 
                        latestIds.contains(prevEntity.getId()) // false 대신 포함 여부 체크
                    ));
                }

                if (nextEntity != null) {
                    dto.setNext(new NoticeDto.NavInfo(
                        nextEntity.getId(), 
                        nextEntity.getTitle(), 
                        latestIds.contains(nextEntity.getId()) // false 대신 포함 여부 체크
                    ));
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

    /**
     * 💾 공지사항 저장/수정 (수동 날짜 기록 버전)
     */
    @Transactional
    public NoticeNtt save(NoticeNtt notice) {
        // [1] 신규 등록
        if (notice.getId() == null) {
            notice.setDeleted(false);
            notice.setViews(0L);
            notice.setCreatedAt(LocalDateTime.now()); // 수동 등록일 설정
            notice.setUpdatedAt(LocalDateTime.now()); // 등록 시 수정일도 동일하게 설정
            return noticeRepository.save(notice);
        }
        
        // [2] 기존 글 수정
        return noticeRepository.findById(notice.getId())
                .map(origin -> {
                    origin.setTitle(notice.getTitle());
                    origin.setContent(notice.getContent());
                    origin.setCategory(notice.getCategory());
                    
                    // ✅ 수정일 수동 업데이트
                    origin.setUpdatedAt(LocalDateTime.now()); 
                    
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