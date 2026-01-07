package com.carpick.domain.member.mapper;

import com.carpick.domain.member.dto.ReservationHistoryResponse;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ReservationHistoryMapper {
    List<ReservationHistoryResponse> selectMyHistory(Long userId);
}
