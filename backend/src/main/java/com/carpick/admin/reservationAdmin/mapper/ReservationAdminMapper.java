package com.carpick.admin.reservationAdmin.mapper;

import com.carpick.admin.reservationAdmin.dto.AdminReservationDetailDto;
import com.carpick.admin.reservationAdmin.dto.AdminReservationListDto;
import com.carpick.domain.reservation.enums.ReservationStatus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface ReservationAdminMapper {
    // 목록 조회 (페이징)
    List<AdminReservationListDto> selectReservationList(
            @Param("status") ReservationStatus status,
            @Param("fromDateTime") LocalDateTime fromDateTime,
            @Param("toDateTime") LocalDateTime toDateTime,
            @Param("keyword") String keyword,   // 예약번호/예약자명/차량번호 등
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    // 상세 조회
    AdminReservationDetailDto selectReservationDetail(
            @Param("reservationId") Long reservationId
    );

    // 전체 건수 (페이징용)
    int countReservationList(
            @Param("status") ReservationStatus status,
            @Param("fromDateTime") LocalDateTime fromDateTime,
            @Param("toDateTime") LocalDateTime toDateTime,
            @Param("keyword") String keyword
    );

}
