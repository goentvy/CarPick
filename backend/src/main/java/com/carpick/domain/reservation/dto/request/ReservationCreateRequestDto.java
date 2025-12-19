package com.carpick.domain.reservation.dto.request;


import lombok.Data;

@Data
public class ReservationCreateRequestDto {
    private Long carId;

    // 대여/반납 방식 (UI: 업체 방문 / 배송 서비스)
    private String method;  // visit / delivery

    private Long pickUpBranchId;
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
