package com.carpick.domain.reservationHistory.mapper;


import com.carpick.domain.reservationHistory.entity.ReservationStatusHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReservationStatusHistoryMapper {
    /** 상태 이력 저장 */
    int insertHistory(ReservationStatusHistory history);

    /** 예약ID 기준 타임라인 조회 (최신순) */
    List<ReservationStatusHistory> selectHistoryByReservationId(@Param("reservationId") long reservationId);

}
