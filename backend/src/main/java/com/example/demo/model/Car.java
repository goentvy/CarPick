package com.example.demo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Car {

    private int carId;             // car_id (PK)
    private int branchId;          // 지점 ID
    private String modelName;      // 모델명
    private String brand;          // 브랜드
    private String segment;        // 세그먼트 (경차/소형/SUV 등)
    private String fuelType;       // 연료 종류 (가솔린/디젤/전기)
    private String transmission;   // 변속기 (오토/수동)
    private int passengerLimit;    // 탑승 가능 인원
    private String color;          // 색상
    private double priceDaily;     // 일일 가격
    private double priceMonthly;   // 월 가격
    private String status;         // AVAILABLE / RENTED
    private String description;    // 차량 설명
    private float ratingAvg;       // 평균 평점
    private int reviewCount;       // 리뷰 개수

    private LocalDateTime createdAt;   // 생성일
    private LocalDateTime updatedAt;   // 수정일
}