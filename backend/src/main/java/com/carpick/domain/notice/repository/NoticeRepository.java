package com.carpick.domain.notice.repository;

import com.carpick.domain.notice.ntt.NoticeNtt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<NoticeNtt, Long> {

    /* =========================
     * 공통 / 유저 / 관리자
     * ========================= */

    // 삭제되지 않은 전체 목록 (비페이징)
    List<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc();

    // 삭제되지 않은 전체 목록 (페이징)
    Page<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    // ✅ 삭제되지 않은 단건 조회 (유저/관리자 공통)
    Optional<NoticeNtt> findByIdAndDeletedFalse(Long id);

    /* =========================
     * 조회수
     * ========================= */

    // ✅ 조회수 증가
    @Modifying
    @Transactional
    @Query("""
        UPDATE NoticeNtt n
        SET n.views = COALESCE(n.views, 0) + 1
        WHERE n.id = :id
    """)
    int incrementViewCount(@Param("id") Long id);

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
     * 이전 / 다음글 (유저 상세)
     * ========================= */

    // 이전글
    NoticeNtt findTop1ByDeletedFalseAndCreatedAtLessThanOrderByCreatedAtDesc(
            LocalDateTime createdAt
    );

    // 다음글
    NoticeNtt findTop1ByDeletedFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(
            LocalDateTime createdAt
    );
}
