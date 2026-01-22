package com.carpick.domain.rent.controller;

import org.springframework.web.bind.annotation.*;

import com.carpick.domain.rent.dto.RentYearResponse;

import java.util.List;

@RestController
@RequestMapping("/api/rent/year")
@CrossOrigin(origins = "http://localhost:5173") // 프론트엔드 포트 허용
public class RentYearController {

    @GetMapping("/details")
    public RentYearResponse getRentYearDetails() {
        return RentYearResponse.builder()
            .conditions(List.of(
                new RentYearResponse.DetailItem("계약기간", "최소 1년 ~ 최장 5년 (신차 - 옵션선택 출고 가능)", "fa-regular fa-calendar"),
                new RentYearResponse.DetailItem("운전자 자격", "만 21세 이상, 운전경력 1년 이상 (단, 10인승 이상 차량은 경력 3년 이상)", "fa-regular fa-user"),
                new RentYearResponse.DetailItem("대여요금", "책임/종합보험 및 정비비 포함 가격", "fa-regular fa-credit-card"),
                new RentYearResponse.DetailItem("약정거리", "연/20,000km ~ 무제한(선택)", "fa-solid fa-car-side"),
                new RentYearResponse.DetailItem("보증 (필요시)", "보증금 또는 계약이행 보증보험증권 설정", "fa-regular fa-shield-check")
            )) //
            .insurance(List.of(
                new RentYearResponse.DetailItem("대인 1·2", "무제한 (대인배상)", "fa-solid fa-user-group"),
                new RentYearResponse.DetailItem("대물", "5천만원 ~ 2억원 (선택사항)", "fa-solid fa-car-burst"),
                new RentYearResponse.DetailItem("자기신체손해", "5천만원 ~ 1억원 (선택사항)", "fa-solid fa-hand-holding-medical")
            )) //
            .maintenance(List.of(
                new RentYearResponse.DetailItem("자차", "고객과실로 인한 자차사고 처리 가능 (사고 건당 개인 부담금 발생)", "fa-solid fa-car-on"),
                new RentYearResponse.DetailItem("정비항목", "부품, 소모품(타이어 포함)의 정상적인 마모 및 노후로 인한 무상교체", "fa-solid fa-screwdriver-wrench"),
                new RentYearResponse.DetailItem("예방정비", "정기적으로 순회정비 실시 (엔진오일교환, 워셔액 보충 등)", "fa-solid fa-clipboard-check")
            )) //
            .build();
    }
}
