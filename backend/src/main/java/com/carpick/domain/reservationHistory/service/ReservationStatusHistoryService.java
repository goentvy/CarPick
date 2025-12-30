package com.carpick.domain.reservationHistory.service;

import com.carpick.domain.reservation.enums.ActorType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservationHistory.entity.ReservationStatusHistory;
import com.carpick.domain.reservationHistory.mapper.ReservationStatusHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationStatusHistoryService {
    private final ReservationStatusHistoryMapper historyMapper;

    /**
     * 히스토리 기록 (예약 상태가 변할 때마다 호출)
     */
    @Transactional
    public void record(Long reservationId, ReservationStatus prev, ReservationStatus curr,
                       ActorType actorType, String actorId, String reason) {

        ReservationStatusHistory history = ReservationStatusHistory.builder()
                .reservationId(reservationId)
                .statusPrev(prev)
                .statusCurr(curr)
                .actorType(actorType)
                .actorId(actorId)
                .reason(reason)
                .build();

        historyMapper.insertHistory(history);
    }

    /**
     * 특정 예약의 히스토리 목록 조회
     */
    public List<ReservationStatusHistory> getHistoryList(Long reservationId) {
        return historyMapper.selectHistoryByReservationId(reservationId);
    }

}
