package com.carpick.domain.notice.ntt;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class) // 자동 날짜 기록 활성화
public class NoticeNtt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 255)
    private String category;

    // ✅ 생성 시 자동 기록 (insertable/updatable 옵션 정리)
    @CreatedDate 
    @Column(name = "created_at", updatable = false) 
    private LocalDateTime createdAt;

    // ✅ 수정 시 자동 업데이트
    @LastModifiedDate 
    @Column(name = "updated_at") 
    private LocalDateTime updatedAt;

    @Column(name = "writer_id")
    private Long writerId;

    @Column(nullable = false)
    private Boolean deleted;

    @Column(nullable = false)
    private Long views = 0L;
}