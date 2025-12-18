package com.carpick.domain.notice.repository;

import com.carpick.domain.notice.ntt.NoticeNtt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NoticeRepository extends JpaRepository<NoticeNtt, Long> {

    /* =========================
     * 공통 / 유저 / 관리자
     * ========================= */

    // 삭제되지 않은 전체 목록 (비페이징)
    List<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc();

    // 삭제되지 않은 전체 목록 (페이징)
    Page<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    /* =========================
     * 관리자 검색
     * ========================= */

    @Query("""
        SELECT n FROM NoticeNtt n
        WHERE n.deleted = false
          AND (
                :keyword IS NULL
             OR :keyword = ''
             OR n.title LIKE %:keyword%
             OR n.content LIKE %:keyword%
          )
        ORDER BY n.createdAt DESC
    """)
    Page<NoticeNtt> searchAdmin(
            @Param("keyword") String keyword,
            Pageable pageable
    );

    /* =========================
     * 이전 / 다음글
     * ========================= */

    NoticeNtt findTop1ByDeletedFalseAndCreatedAtLessThanOrderByCreatedAtDesc(
            LocalDateTime createdAt
    );

    NoticeNtt findTop1ByDeletedFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(
            LocalDateTime createdAt
    );
}
