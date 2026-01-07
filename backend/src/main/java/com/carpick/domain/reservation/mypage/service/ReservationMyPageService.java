package com.carpick.domain.reservation.mypage.service;

import com.carpick.domain.reservation.mypage.dto.ReservationDetailDto;
import com.carpick.domain.reservation.mypage.dto.ReservationListDto;
import com.carpick.domain.reservation.mypage.mapper.ReservationMyPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationMyPageService {
    private final ReservationMyPageMapper reservationMyPageMapper;
    public List<ReservationListDto> getReservationList(Long userId) {
        return reservationMyPageMapper.selectReservationListByUserId(userId);
    }

    public ReservationDetailDto getReservationDetail(Long userId, Long reservationId) {
        ReservationDetailDto detail = reservationMyPageMapper.selectReservationDetail(userId, reservationId);

        if (detail == null) {
            throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다. reservationId=" + reservationId);
        }

        return detail;
    }



}
