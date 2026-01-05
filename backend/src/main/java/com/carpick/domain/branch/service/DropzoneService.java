package com.carpick.domain.branch.service;

import com.carpick.domain.branch.dto.DropzonePointDto;
import com.carpick.domain.branch.dto.DropzoneStatusDto;
import com.carpick.domain.branch.mapper.DropzoneMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

/**
 * ✅ 비즈니스 로직 담당
 * - 목록은 DB 그대로
 * - status는 시간대 + 안정적 랜덤으로 즉석 생성
 */
@Service
@RequiredArgsConstructor
public class DropzoneService {

    private final DropzoneMapper dropzoneMapper;

    /** 지도용 드롭존 목록 */
    public List<DropzonePointDto> getDropzones(long branchId) {
        return dropzoneMapper.findByBranchId(branchId);
    }

    /** 혼잡도(추정) */
    public DropzoneStatusDto getStatus(long dropzoneId) {

        // 1) 존재/운영 확인
        DropzonePointDto check = dropzoneMapper.findById(dropzoneId);
        if (check == null || Boolean.FALSE.equals(check.getIsActive())) {
            return DropzoneStatusDto.builder()
                    .dropzoneId(dropzoneId)
                    .capacity(0)
                    .currentCount(0)
                    .occupancyRate(0.0)
                    .status("INACTIVE")
                    .label("운영중지")
                    .measuredAt(LocalDateTime.now())
                    .build();
        }

        // 2) 시간대 baseRate
        int hour = LocalTime.now().getHour();
        double base = baseRateByHour(hour);

        // 3) 안정적 랜덤: 1분 단위로만 조금 변하게
        long minuteBucket = System.currentTimeMillis() / 60_000L;
        long seed = (dropzoneId * 31L) ^ (minuteBucket * 131L);
        Random r = new Random(seed);

        // MVP는 과하지 않게 ±0.10
        double jitter = (r.nextDouble() * 0.20) - 0.10;

        double occ = clamp01(base + jitter);

        // 4) capacity 가짜(5~8)
        int capacity = 5 + (int) (Math.abs(dropzoneId) % 4);
        int current = (int) Math.round(capacity * occ);

        // 5) 상태/라벨
        String status = statusFrom(occ, current, capacity);
        String label = labelFrom(status);

        // 6) 소수점 3자리로 흔들림 최소화
        double rounded = Math.round(occ * 1000.0) / 1000.0;

        return DropzoneStatusDto.builder()
                .dropzoneId(dropzoneId)
                .capacity(capacity)
                .currentCount(current)
                .occupancyRate(rounded)
                .status(status)
                .label(label)
                .measuredAt(LocalDateTime.now())
                .build();
    }

    /* ---------- 내부 계산 ---------- */

    private double baseRateByHour(int hour) {
        if (hour >= 7 && hour <= 10) return 0.70;
        if (hour >= 17 && hour <= 21) return 0.78;
        if (hour >= 11 && hour <= 16) return 0.55;
        return 0.35;
    }

    private double clamp01(double v) {
        return Math.max(0.0, Math.min(1.0, v));
    }

    private String statusFrom(double occ, int current, int capacity) {
        if (current >= capacity || occ >= 0.90) return "FULL";
        if (occ >= 0.75) return "CROWDED";
        if (occ >= 0.45) return "NORMAL";
        return "FREE";
    }

    private String labelFrom(String status) {
        return switch (status) {
            case "FULL" -> "만차";
            case "CROWDED" -> "혼잡";
            case "NORMAL" -> "보통";
            case "FREE" -> "여유";
            default -> "운영중지";
        };
    }
}