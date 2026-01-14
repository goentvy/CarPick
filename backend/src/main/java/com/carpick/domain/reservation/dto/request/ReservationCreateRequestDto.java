package com.carpick.domain.reservation.dto.request;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class ReservationCreateRequestDto {
    private Long carId;
    // ▼▼▼ 이 두 줄이 없어서 에러가 났던 겁니다. 추가해주세요! ▼▼▼
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String startDateTime; // 예: "2025-12-30 10:00:00"
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String endDateTime;   // 예: "2025-12-31 10:00:00"
    // 대여/반납 방식 (UI: 업체 방문 / 배송 서비스)
    private String method;  // visit / delivery

    private Long pickupBranchId;
    private Long returnBranchId;

    private  String insuranceCode; // NONE / NORMAL / FULL

    private DriverInfoDto driverInfo;
    private boolean agreement;
    @Data
    public static class DriverInfoDto{
        private String lastname;
        private String firstname;
        private String phone;
        private String email;
        private String birth;

    }

}
