package com.carpick.ntt;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "notice")
public class NoticeNtt {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	private String category;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "writer_id")
	private Long writerId;

	@Column(nullable = false)
	private Boolean deleted = false;

	@Column(nullable = false)
	private Long views = 0L;

	public NoticeNtt() {}

	// getters & setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }

	public String getContent() { return content; }
	public void setContent(String content) { this.content = content; }

	public String getCategory() { return category; }
	public void setCategory(String category) { this.category = category; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public LocalDateTime getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

	public Long getWriterId() { return writerId; }
	public void setWriterId(Long writerId) { this.writerId = writerId; }

	public Boolean getDeleted() { return deleted; }
	public void setDeleted(Boolean deleted) { this.deleted = deleted; }

	public Long getViews() { return views; }
	public void setViews(Long views) { this.views = views; }

	// viewCount getter/setter for compatibility
	public Long getViewCount() { return views; }
	public void setViewCount(Long viewCount) { this.views = viewCount; }

	@JsonIgnore
	public boolean isDeleted() {
		return deleted != null && deleted;
	}

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		if (deleted == null) deleted = false;
		if (views == null) views = 0L;
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}