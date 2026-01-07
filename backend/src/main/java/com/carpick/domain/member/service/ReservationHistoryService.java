    package com.carpick.domain.member.service;

    import com.carpick.domain.member.dto.ReservationHistoryResponse;
    import com.carpick.domain.member.mapper.ReservationHistoryMapper;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;

    import java.util.List;

    @Service
    @RequiredArgsConstructor
    public class ReservationHistoryService {

        private final ReservationHistoryMapper historyMapper;

        public List<ReservationHistoryResponse> getMyHistory(Long userId) {
            System.out.println("### SERVICE getMyHistory userId=" + userId);
            List<ReservationHistoryResponse> history = historyMapper.selectMyHistory(userId);
            System.out.println("### SERVICE history count=" + history.size());
            return history;
        }
    }
