package com.carpick.domain.reservation.dtoV2.request;

import com.carpick.domain.reservation.enums.RentType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class ReservationFormRequestDtoV2 {
//    예약하기 버튼 눌렀을 때 서버로 날아오는 데이터 (POST Body)
    private Long specId;
    private Long pickupBranchId;

    private RentType rentType;

    @JsonProperty("startDateTime")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startAt;

    @JsonProperty("endDateTime")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endAt;
    // 예약 버튼 활성화 및 입력 검증용 (Form 단계)
    // 실제 저장은 ReservationCreate에서 처리
    private DriverInfoDtoV2 driverInfo;
    @Data
    public static class DriverInfoDtoV2{
        private String lastname;
        private String firstname;
        private String phone;
        private String email;
        private String birth;

    }
}
