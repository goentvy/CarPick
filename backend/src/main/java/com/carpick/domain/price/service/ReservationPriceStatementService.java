package com.carpick.domain.price.service;


import com.carpick.domain.price.dto.ReservationPriceStatementResponseDto;
import com.carpick.domain.price.entity.ReservationPriceDetail;
import com.carpick.domain.price.mapper.ReservationPriceDetailMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationPriceStatementService {

    private final ReservationPriceDetailMapper priceDetailMapper;

    // 저장 (Create) - 트랜잭션은 상위(ReservationCreateService)에서 관리하는 것을 권장
    public void save(ReservationPriceDetail detail) {
        if (detail == null) {
            throw new IllegalArgumentException("detail이 비어있습니다.");
        }
        if (detail.getReservationId() == null) {
            throw new IllegalArgumentException("reservationId가 비어있습니다.");
        }

        priceDetailMapper.insertPriceDetail(detail);
    }

    // 조회 (Read)
    @Transactional(readOnly = true)
    public ReservationPriceStatementResponseDto getByReservationId(Long reservationId) {
        if (reservationId == null) {
            throw new IllegalArgumentException("reservationId가 비어있습니다.");
        }
        return priceDetailMapper.findStatementByReservationId(reservationId);
    }

}
