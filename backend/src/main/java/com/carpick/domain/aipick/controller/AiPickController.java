package com.carpick.domain.aipick.controller;

import com.carpick.domain.aipick.dto.AiCarCardDto;


import com.carpick.domain.aipick.dto.AiPickRequest;
import com.carpick.domain.aipick.dto.AiPickResponse;
import com.carpick.domain.aipick.service.AiPickService;
import com.carpick.domain.car.enums.CarClass;
import com.carpick.domain.car.mapper.CarMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-pick")
@RequiredArgsConstructor
@Slf4j
public class AiPickController {

    private final CarMapper carMapper;
    private final AiPickService aiPickService;
    @GetMapping("/cars")
    public ResponseEntity<List<AiCarCardDto>> getCarsByClass(@RequestParam String carClass) {

        CarClass enumClass;
        try {
            // "SUV" 같은 영문 enum 이름이 들어온다고 가정
            enumClass = CarClass.valueOf(carClass.toUpperCase());
        } catch (Exception e) {
            // 잘못된 값이 오면 400
            return ResponseEntity.badRequest().build();
        }

        List<AiCarCardDto> cars = carMapper.selectCarCardByCarClass(enumClass);
        return ResponseEntity.ok(cars);
    }
    /**
     * 🚀 [POST] /api/ai-pick/recommend
     * 버튼으로 선택한 키워드들을 받아서, AI 추천 결과를 반환합니다.
     */
    @PostMapping("/recommend")
    public ResponseEntity<AiPickResponse> recommend(@RequestBody AiPickRequest request) {

        // 1. 프론트에서 보낸 리스트 꺼내기
        // 예: ["가족여행", "짐 많음"]
        List<String> options = request.getSelectedOptions();

        // 2. 리스트를 문장으로 합치기 (AI에게 보낼 프롬프트 만들기)
        // 예: "가족여행, 짐 많음"
        String userMessage = (options != null && !options.isEmpty())
                ? String.join(", ", options)
                : "추천해줘"; // 선택한 게 없으면 기본값

        log.info("📢 [AI 추천 요청] 키워드: {}", userMessage);

        // 3. 서비스 호출 (AI 통신 + DB 조회 + DTO 변환을 알아서 다 해옴)
        AiPickResponse response = aiPickService.getRecommendation(userMessage);

        // 4. 결과 리턴 (JSON)
        return ResponseEntity.ok(response);
    }

}
