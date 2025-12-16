package com.carpick.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.ntt.NoticeNtt;

public interface NoticeRepository extends JpaRepository<NoticeNtt, Long> {
	
	@Query("SELECT n FROM NoticeNtt n WHERE n.deleted = false ORDER BY n.createdAt DESC")
	List<NoticeNtt> findByDeletedFalseOrderByCreatedAtDesc();

	@Modifying
	@Transactional
	@Query("UPDATE NoticeNtt n SET n.views = COALESCE(n.views, 0) + 1 WHERE n.id = :id")
	int incrementViewCount(@Param("id") Long id);
	
	@Query("SELECT n FROM NoticeNtt n WHERE n.deleted = false AND n.title LIKE %:keyword% ORDER BY n.createdAt DESC")
	List<NoticeNtt> findByKeywordOrderByCreatedAtDesc(@Param("keyword") String keyword);
	
	// 이전 공지사항 (현재보다 이전 날짜 중 가장 최근)
	@Query("SELECT n FROM NoticeNtt n WHERE n.deleted = false AND n.createdAt < :createdAt ORDER BY n.createdAt DESC LIMIT 1")
	NoticeNtt findPrevNotice(@Param("createdAt") java.time.LocalDateTime createdAt);
	
	// 다음 공지사항 (현재보다 이후 날짜 중 가장 이른)
	@Query("SELECT n FROM NoticeNtt n WHERE n.deleted = false AND n.createdAt > :createdAt ORDER BY n.createdAt ASC LIMIT 1")
	NoticeNtt findNextNotice(@Param("createdAt") java.time.LocalDateTime createdAt);
}