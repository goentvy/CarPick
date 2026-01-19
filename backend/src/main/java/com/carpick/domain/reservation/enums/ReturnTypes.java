package com.carpick.domain.reservation.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReturnTypes {


    VISIT("지점 방문 반납","고객이 운영 시간 내에 지점으로 방문하여 반납"),


    DROPZONE("드롭존 수거 반납","고객이 지정된 무인 드롭존(주차장)에 주차 후 반납 처리");

    private final String description;
    private final String detail;
}
