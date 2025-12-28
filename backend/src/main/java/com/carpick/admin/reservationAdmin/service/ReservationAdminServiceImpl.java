package com.carpick.admin.reservationAdmin.service;


import com.carpick.admin.reservationAdmin.dto.AdminReservationDetailDto;
import com.carpick.admin.reservationAdmin.dto.AdminReservationListDto;
import com.carpick.admin.reservationAdmin.mapper.ReservationAdminMapper;
import com.carpick.admin.reservationAdmin.mapper.ReservationAdminService;
import com.carpick.domain.reservation.enums.ReservationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationAdminServiceImpl implements ReservationAdminService {
    private final ReservationAdminMapper reservationAdminMapper;

    @Override
    public List<AdminReservationListDto> getReservationList(
            ReservationStatus status,
            LocalDateTime fromDateTime,
            LocalDateTime toDateTime,
            String keyword,
            int page,
            int size
    ) {
        // ✅ page는 1부터 받는다고 가정
        int offset = (page - 1) * size;

        return reservationAdminMapper.selectReservationList(
                status,
                fromDateTime,
                toDateTime,
                keyword,
                offset,
                size
        );
    }

    @Override
    public int getReservationCount(
            ReservationStatus status,
            LocalDateTime fromDateTime,
            LocalDateTime toDateTime,
            String keyword
    ) {
        return reservationAdminMapper.countReservationList(
                status,
                fromDateTime,
                toDateTime,
                keyword
        );
    }

    @Override
    public AdminReservationDetailDto getReservationDetail(Long reservationId) {
        return reservationAdminMapper.selectReservationDetail(reservationId);
    }


}
