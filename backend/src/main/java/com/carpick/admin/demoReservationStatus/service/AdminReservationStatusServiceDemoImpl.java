package com.carpick.admin.demoReservationStatus.service;

import com.carpick.admin.demoReservationStatus.dto.AdminReservationStatusDtoDemo;
import com.carpick.admin.demoReservationStatus.mapper.AdminReservationStatusMapperDemo;
import com.carpick.admin.demoReservationStatus.mapper.AdminReservationStatusServiceDemo;
import com.carpick.domain.reservation.enums.ReservationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReservationStatusServiceDemoImpl  implements AdminReservationStatusServiceDemo {
    private final AdminReservationStatusMapperDemo mapper;

    @Override
    @Transactional
    public void changeStatus(Long reservationId, ReservationStatus status) {
        if (reservationId == null) {
            throw new IllegalArgumentException("reservationId는 필수입니다.");
        }
        if (status == null) {
            throw new IllegalArgumentException("status는 필수입니다.");
        }

        int updated = mapper.updateReservationStatus(reservationId, status);

        if (updated == 0) {
            throw new IllegalStateException("상태 변경 실패: reservationId=" + reservationId);
        }
    }
    @Override
    @Transactional(readOnly = true)
    public List<AdminReservationStatusDtoDemo> getReservationList() {
        return mapper.selectReservationList();
    }


}
