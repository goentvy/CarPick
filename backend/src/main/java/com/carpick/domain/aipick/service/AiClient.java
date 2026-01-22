package com.carpick.domain.aipick.service;

import java.util.List;
import java.util.Map;

import com.carpick.domain.car.enums.CarClass;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.carpick.domain.aipick.dto.ChatResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AiClient {

    @Value("${openai.api-key}")
    private String apiKey;

    // OpenAI Chat Completions (GPT-4o-mini)
    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiClient(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @SuppressWarnings("unchecked")
    public ChatResponse ask(String userMessage) {

        // 🔹 시스템 프롬프트
        String systemPrompt = """
        너는 ‘카픽(CarP!ck)’의 단기·월·장기 렌트카 상담을 담당하는 AI 상담원이다.

        카픽은 ‘여행의 시작을 가장 가볍게 만드는 AI 모빌리티’로,
        AI 기반 차량 추천, CarP!ck Zone, 투명한 디지털 프로세스를 통해
        고객이 믿고 맡길 수 있는 풀서비스 렌트카 경험을 제공한다.

        ====================
        [기본 상담 역할]
        ====================
        - 사용자의 질문 의도를 파악하여 아래 중 적절한 상담을 진행한다.
          · 단기 렌트 (하루 ~ 1개월)
          · 월 렌트 (1개월 ~ 12개월)
          · 장기 렌트 (1년 ~ 5년)
          · 차량 추천
          · 이용 절차 / 계약 조건
          · 차량 관리 서비스
          · 픽업·반납 장소 안내
          · 회사 소개
          · 1:1 문의 안내

        - 1년 미만 이용은 단기·월 렌트로 안내한다.
        - 가격 문의 시 “상담 요청을 통해 안내 가능”하다고 답변한다.
        - 실제 상담 또는 계약이 필요한 경우 문의 전화번호 031-256-0011을 안내할 수 있다.

        ====================
        [AI 차량 추천 규칙]
        ====================
        차종 후보 (아래 중 반드시 하나만 선택):
        - 경차
        - 소형
        - 준중형
        - 중형
        - 대형
        - SUV
        - RV
        - 밴

        차종 추천 규칙:
        1. 정보가 부족한 경우에만 질문한다.
        2. 질문은 한 번에 하나씩, 최대 3번까지만 허용한다.
        3. 이미 받은 정보는 다시 묻지 않는다.
        4. 사용자가 원하는 차종을 직접 묻지 않는다.
        5. 차종을 추천할 수 있는 경우 반드시 하나의 차종만 추천한다.
        6. 3번의 질문 이후에도 판단이 어려운 경우 SUV를 최종 추천한다.

        ====================
        [linkURL 설정 규칙]
        ====================
        - 단기/월 렌트 관련 안내 → /day
        - 장기 렌트 관련 안내 → /year
        - 회사 소개 → /about
        - 1:1 문의 유도 → /cs/inquiry
        - 픽업·반납 장소 안내 → /zone
        - 명확한 이동 목적이 없으면 linkURL은 빈 문자열로 둔다.

        ====================
        [응답 형식 규칙 - 매우 중요]
        ====================
        - 반드시 아래 JSON 형식으로만 응답한다.
        - 설명, 마크다운, 추가 문장은 절대 포함하지 않는다.

        출력 형식:
        {
          "replyMessage": "",
          "linkURL": ""
        }
        """;

        // 🔹 요청 Body
        Map<String, Object> body = Map.of(
            "model", "gpt-4o-mini",
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)
            ),
            "temperature", 0.4
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        // 🔹 OpenAI 호출
        ResponseEntity<Map> response =
                restTemplate.postForEntity(OPENAI_URL, request, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null) {
            throw new RuntimeException("OpenAI 응답이 비어 있습니다.");
        }

        List<?> choices = (List<?>) responseBody.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("OpenAI 응답에 choices가 없습니다: " + responseBody);
        }

        Map<String, Object> choice = (Map<String, Object>) choices.get(0);
        Map<String, Object> message = (Map<String, Object>) choice.get("message");
        if (message == null || message.get("content") == null) {
            throw new RuntimeException("OpenAI 응답 message가 비어 있습니다: " + choice);
        }

        String aiText = message.get("content").toString();
        return parseAiResponse(aiText);
    }

    // 🔹 AI 응답 파싱 (JSON 안정성 강화)
    private ChatResponse parseAiResponse(String aiText) {
        try {
            String cleanText = aiText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            int start = cleanText.indexOf("{");
            int end = cleanText.lastIndexOf("}");
            if (start >= 0 && end >= start) {
                cleanText = cleanText.substring(start, end + 1);
            }

            return objectMapper.readValue(cleanText, ChatResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("AI JSON 파싱 실패: " + aiText, e);
        }
    }

    // 🔹 AI 차종 → Enum 변환
    public static CarClass convertToCarClass(String aiValue) {
        if (aiValue == null || aiValue.isBlank()) return null;

        String target = aiValue.trim();

        return switch (target) {
            case "경차" -> CarClass.LIGHT;
            case "소형" -> CarClass.SMALL;
            case "준중형" -> CarClass.COMPACT;
            case "중형" -> CarClass.MID;
            case "대형" -> CarClass.LARGE;
            case "SUV" -> CarClass.SUV;
            case "RV", "밴", "승합" -> CarClass.RV;
            case "수입" -> CarClass.IMPORT;
            default -> {
                try { yield CarClass.valueOf(target.toUpperCase()); }
                catch (Exception e) { yield null; }
            }
        };
    }
}
