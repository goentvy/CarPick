package com.carpick.domain.branch.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 드롭존 혼잡도(추정) 응답 DTO
 * - DB 저장 없이 서버에서 즉석 생성
 */
@Getter
@Builder
public class DropzoneStatusDto {
    private long dropzoneId;

    private int capacity;
    private int currentCount;
    private double occupancyRate;

    private String status; // FREE | NORMAL | CROWDED | FULL | INACTIVE
    private String label;  // 여유 | 보통 | 혼잡 | 만차 | 운영중지

    private LocalDateTime measuredAt;
}
