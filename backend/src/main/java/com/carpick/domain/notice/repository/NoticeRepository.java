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

    // 전체 공지 목록
    List<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc();

    Page<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    Optional<NoticeNtt> findByIdAndDeletedFalse(Long id);

    // 조회수 증가
    @Modifying
    @Transactional
    @Query("""
        UPDATE NoticeNtt n
        SET n.views = COALESCE(n.views, 0) + 1
        WHERE n.id = :id
    """)
    int incrementViewCount(@Param("id") Long id);

    // 검색 (관리자/유저 공용)
    @Query("""
        SELECT n FROM NoticeNtt n
        WHERE n.deleted = false
          AND (:keyword IS NULL OR :keyword = ''
               OR n.title LIKE %:keyword%
               OR n.content LIKE %:keyword%)
        ORDER BY n.createdAt DESC
    """)
    Page<NoticeNtt> search(@Param("keyword") String keyword, Pageable pageable);

    // 이전/다음글
    NoticeNtt findTop1ByDeletedFalseAndCreatedAtLessThanOrderByCreatedAtDesc(LocalDateTime createdAt);

    NoticeNtt findTop1ByDeletedFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(LocalDateTime createdAt);
}
