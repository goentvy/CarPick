package com.carpick.domain.branch.service;

import com.carpick.domain.branch.dto.DropzoneStatusDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

/**
 * ✅ 혼잡도 '추정' 계산 전담 컴포넌트
 * - DB 접근 없음
 * - 입력(dropzoneId) -> 결과(status dto 일부) 생성
 */
@Component
public class DropzoneStatusEstimator {

    public DropzoneStatusDto estimate(long dropzoneId) {
        int hour = LocalTime.now().getHour();
        double base = baseRateByHour(hour);

        long minuteBucket = System.currentTimeMillis() / 60_000L;
        long seed = (dropzoneId * 31L) ^ (minuteBucket * 131L);
        Random r = new Random(seed);

        double jitter = (r.nextDouble() * 0.20) - 0.10;
        double occ = clamp01(base + jitter);

        int capacity = 5 + (int) (Math.abs(dropzoneId) % 4);
        int current = (int) Math.round(capacity * occ);

        String status = statusFrom(occ, current, capacity);
        String label = labelFrom(status);

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

