package com.carpick.domain.reservation.mypage.mapper;

import com.carpick.domain.reservation.mypage.dto.ReservationDetailDto;
import com.carpick.domain.reservation.mypage.dto.ReservationListDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReservationMyPageMapper {
    List<ReservationListDto> selectReservationListByUserId(@Param("userId") Long userId);

    ReservationDetailDto selectReservationDetail(
            @Param("userId") Long userId,
            @Param("reservationId") Long reservationId
    );

}
