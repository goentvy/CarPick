package com.carpick.domain.aipick.service;

import com.carpick.domain.aipick.dto.AiCarCardDto;
import com.carpick.domain.aipick.dto.AiPickResponse;
import com.carpick.domain.aipick.dto.ChatResponse;
import com.carpick.domain.car.enums.CarClass;
import com.carpick.domain.car.mapper.CarMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiPickService {
    private final AiClient aiClient;      // 팀장 코드 (안 건드림)
    private final CarMapper carMapper;

    /**
     * 사용자 메시지 → AI 차종 추천 → 해당 차종 차량 카드 목록 반환
     */
    public AiPickResponse getRecommendation(String userMessage) {

        // 1) AI 호출 (예외 방어)
        final ChatResponse aiResponse;
        try {
            aiResponse = aiClient.ask(userMessage);
        } catch (Exception e) {
            log.error("[AiPick] AI 호출 실패", e);
            return AiPickResponse.builder()
                    .replyMessage("AI 연결이 지연되고 있습니다.")
                    .carType(null)
                    .carClass(null)
                    .cars(Collections.emptyList())
                    .build();
        }

        // 2) 응답 null/필드 방어
        if (aiResponse == null || aiResponse.getCarType() == null || aiResponse.getCarType().isBlank()) {
            log.warn("[AiPick] AI 응답이 비어있음. aiResponse={}", aiResponse);
            return AiPickResponse.builder()
                    .replyMessage("추천 차종을 판단하지 못했습니다.")
                    .carType(null)
                    .carClass(null)
                    .cars(Collections.emptyList())
                    .build();
        }

        final String aiCarType = aiResponse.getCarType().trim();        // 예: "SUV" or "중형" 등
        final String aiComment = aiResponse.getReplyMessage();          // 예: "가족여행엔 SUV죠"
        log.debug("[AiPick] AI 응답 carType={}, reply={}", aiCarType, aiComment);

        // 3) 차종 변환 (한글/영문 → Enum). 변환 실패 시 방어
        final CarClass carClass = AiClient.convertToCarClass(aiCarType);
        if (carClass == null) {
            log.warn("[AiPick] 차종 변환 실패. aiCarType={}", aiCarType);
            return AiPickResponse.builder()
                    .replyMessage(aiComment != null ? aiComment : "추천 차종을 판단하지 못했습니다.")
                    .carType(aiCarType)
                    .carClass(null)
                    .cars(Collections.emptyList())
                    .build();
        }

        // 4) DB 조회 (카드 DTO로 한방)
        List<AiCarCardDto> cars;
        try {
            cars = carMapper.selectCarCardByCarClass(carClass);
        } catch (Exception e) {
            log.error("[AiPick] DB 조회 실패 carClass={}", carClass, e);
            cars = Collections.emptyList();
        }

        // ✅ (중요) 카드의 aiSummary를 aiComment로 덮어쓰지 않습니다.
        // - 카드 aiSummary는 차량별 요약 (DB값) 유지
        // - AI 코멘트는 replyMessage로만 전달

        return AiPickResponse.builder()
                .replyMessage(aiComment != null ? aiComment : "")
                .carType(aiCarType)
                .carClass(carClass.name())
                .cars(cars)
                .build();
    }


}
