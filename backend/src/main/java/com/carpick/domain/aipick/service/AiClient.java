package com.carpick.domain.aipick.service;

import java.util.Arrays;
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

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
	public ChatResponse ask(String userMessage) {

        RestTemplate restTemplate = new RestTemplate();

        // 🔹 시스템 프롬프트
        String systemPrompt = """
        너는 렌트카 추천을 도와주는 AI 상담원이다.

        목표:
        - 사용자의 입력에서 다음 정보를 파악한다.
          1. 차종 추천 가능 여부

        규칙:
		1. 정보가 부족하면 한 번에 하나의 질문만 최대 3개까지 replyMessage에 작성한다.
		2. 다음 차종 후보 가운데 추천이 가능하면 반드시 하나의 차종만 추천한다.
		차종 후보:
	    - 경차
	    - 소형
	    - 준중형
	    - 중형
	    - 대형
	    - SUV
	    - RV
	    - 밴
		3. 이미 받은 정보는 다시 묻지 않는다.
		4. replyMessage는 사용자에게 보여줄 문장이다.
		5. 질문은 최대 3번까지만 허용한다. 
		6. 질문을 3번 진행한 이후에도 차종을 명확히 판단할 수 없는 경우에만, SUV를 최종 추천한다. 
		7. 차종을 추천할 수 있는 경우 반드시 하나의 차종만 추천한다. 
		8. replyMessage는 사용자에게 보여줄 자연스럽고 친절한 한글 문장이다.
		9. 어떤 차종을 원하는 지는 묻지 않는다.
		
		⚠️ 반드시 아래 JSON 형식으로만 응답하라.
		⚠️ 설명, 마크다운, 문장은 절대 추가하지 마라.
		
		{
		  "replyMessage": "",
		  "carType": null
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

        // 🔹 응답 파싱
        Map<String, Object> message =
                (Map<String, Object>) ((List<?>) response.getBody().get("choices"))
                        .get(0);

        Map<String, Object> content =
                (Map<String, Object>) ((Map<?, ?>) message.get("message"));

        String aiText = content.get("content").toString();

        return parseAiResponse(aiText);
    }

    // 🔹 AI 응답 파싱
    private ChatResponse parseAiResponse(String aiText) {
        try {
            // 🔥 JSON 문자열 → 객체로 바로 변환
            String cleanText = aiText.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(cleanText, ChatResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("AI JSON 파싱 실패: " + aiText, e);
        }
    }

    private String extract(String text, String key) {
        return Arrays.stream(text.split("\n"))
                .filter(line -> line.startsWith(key))
                .map(line -> line.replace(key, "").trim())
                .findFirst()
                .orElse(null);
    }
    // 🔹 [대체] fromAiValue 대신 사용하는 강력한 변환기
    public static CarClass convertToCarClass(String aiValue) {
        if (aiValue == null || aiValue.isBlank()) return null;

        String target = aiValue.trim();

        // 한글 단어들을 내 Enum으로 매핑
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
                // 혹시 영어나 다른게 오면 원래 이름으로 시도
                try { yield CarClass.valueOf(target.toUpperCase()); }
                catch (Exception e) { yield null; }
            }
        };
    }

}
