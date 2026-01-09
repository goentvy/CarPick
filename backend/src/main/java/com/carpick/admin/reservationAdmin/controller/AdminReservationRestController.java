package com.carpick.admin.reservationAdmin.controller;

import com.carpick.admin.reservationAdmin.dto.AdminReservationDetailDto;
import com.carpick.admin.reservationAdmin.dto.AdminReservationListDto;
import com.carpick.admin.reservationAdmin.mapper.ReservationAdminService;
import com.carpick.common.dto.Pagination;
import com.carpick.domain.reservation.enums.ReservationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/reservation")
@RequiredArgsConstructor
public class AdminReservationRestController {
    private final ReservationAdminService reservationService;

    /**
     * 관리자 예약 목록 조회
     *
     * Response:
     * {
     *   "data": [...],
     *   "pagination": {...}
     * }
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getReservationList(
            @RequestParam(required = false) ReservationStatus status,

            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate toDate,

            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        /* =========================
         * 1️⃣ 파라미터 방어
         * ========================= */
        page = Math.max(page, 1);
        size = Math.max(size, 1);

        /* =========================
         * 2️⃣ 날짜 변환 (일 단위 검색)
         * ========================= */
        LocalDateTime fromDateTime =
                (fromDate != null) ? fromDate.atStartOfDay() : null;

        LocalDateTime toDateTime =
                (toDate != null) ? toDate.atTime(LocalTime.MAX) : null;

        /* =========================
         * 3️⃣ 로그 (관리자 조회는 로그 중요)
         * ========================= */
        log.debug(
                "[ADMIN][RESERVATION_LIST] status={}, from={}, to={}, keyword={}, page={}, size={}",
                status, fromDateTime, toDateTime, keyword, page, size
        );

        /* =========================
         * 4️⃣ 서비스 호출
         * ========================= */
        List<AdminReservationListDto> list =
                reservationService.getReservationList(
                        status,
                        fromDateTime,
                        toDateTime,
                        keyword,
                        page,
                        size
                );

        int totalCount =
                reservationService.getReservationCount(
                        status,
                        fromDateTime,
                        toDateTime,
                        keyword
                );

        /* =========================
         * 5️⃣ 페이징 정보 생성
         * ========================= */
        Pagination pagination = new Pagination(totalCount, page, size);

        /* =========================
         * 6️⃣ 응답 구성
         * ========================= */
        Map<String, Object> response = new HashMap<>();
        response.put("data", list);
        response.put("pagination", pagination);

        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 예약 상세 조회
     */
    @GetMapping("/{reservationId}")
    public ResponseEntity<AdminReservationDetailDto> getReservationDetail(
            @PathVariable Long reservationId
    ) {
        log.debug("[ADMIN][RESERVATION_DETAIL] reservationId={}", reservationId);

        AdminReservationDetailDto detail =
                reservationService.getReservationDetail(reservationId);

        if (detail == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(detail);
    }


}
