package com.carpick.domain.price.mapper;


import com.carpick.domain.price.dto.ReservationPriceStatementResponseDto;
import com.carpick.domain.price.entity.ReservationPriceDetail;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReservationPriceDetailMapper {

    void insertPriceDetail(ReservationPriceDetail entity);

    ReservationPriceStatementResponseDto findStatementByReservationId(Long reservationId);

}
