package com.carpick.domain.notice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.notice.ntt.NoticeNtt;

public interface NoticeRepository extends JpaRepository<NoticeNtt, Long> {

    /* =========================
     * 기존 기능 (유지)
     * ========================= */

    // 목록
    List<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc();

    // 조회수 증가
    @Modifying
    @Transactional
    @Query("UPDATE NoticeNtt n SET n.views = COALESCE(n.views, 0) + 1 WHERE n.id = :id")
    int incrementViewCount(@Param("id") Long id);

    // 제목 + 내용 검색 (List)
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

    // 이전글
    NoticeNtt findTop1ByDeletedFalseAndCreatedAtLessThanOrderByCreatedAtDesc(
        LocalDateTime createdAt
    );

    // 다음글
    NoticeNtt findTop1ByDeletedFalseAndCreatedAtGreaterThanOrderByCreatedAtAsc(
        LocalDateTime createdAt
    );


    /* =========================
     * ✅ 추가: 관리자 페이지용 (페이징)
     * ========================= */

    // 전체 목록 + 페이징
    Page<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    // 검색 + 페이징
    Page<NoticeNtt> findByDeletedFalseAndTitleContainingOrDeletedFalseAndContentContaining(
            String titleKeyword,
            String contentKeyword,
            Pageable pageable
    );
}
