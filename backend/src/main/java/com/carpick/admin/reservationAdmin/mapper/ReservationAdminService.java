package com.carpick.admin.reservationAdmin.mapper;

import com.carpick.admin.reservationAdmin.dto.AdminReservationDetailDto;
import com.carpick.admin.reservationAdmin.dto.AdminReservationListDto;
import com.carpick.domain.reservation.enums.ReservationStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationAdminService {

    /**
     * 관리자 예약 목록 조회 (페이징)
     */
    List<AdminReservationListDto> getReservationList(
            ReservationStatus status,
            LocalDateTime fromDateTime,
            LocalDateTime toDateTime,
            String keyword,
            int page,
            int size
    );

    /**
     * 관리자 예약 목록 전체 건수
     */
    int getReservationCount(
            ReservationStatus status,
            LocalDateTime fromDateTime,
            LocalDateTime toDateTime,
            String keyword
    );

    /**
     * 관리자 예약 상세 조회
     */
    AdminReservationDetailDto getReservationDetail(Long reservationId);

}
