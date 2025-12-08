package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api-key}")
    private String OPENAI_API_KEY;

    public Map<String, String> getRecommendedSegment(List<String> options) {

    String prompt = """
            너는 차량 추천 전문가야.
            아래 사용자가 선택한 정보들을 보고 가장 적합한 차종을 하나만 추천해줘.

            차종 후보:
            - 경차
            - 소형
            - 준중형
            - 중형
            - 대형
            - SUV
            - RV
            - 밴

            사용자가 선택한 정보:
            %s

            출력 형식:
            {"segment": "SUV", "reason": "추천 이유를 160자 이내로 상세하게 작성"}
            """.formatted(String.join(", ", options));

    try {
        RestTemplate rest = new RestTemplate();

        // JSON을 문자열이 아닌 객체로 구성
        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("model", "gpt-4o-mini");

        List<Map<String, String>> messages = List.of(
            Map.of("role", "system", "content", "You are a car segment recommendation system."),
            Map.of("role", "user", "content", prompt)
        );

        bodyMap.put("messages", messages);

        String body = objectMapper.writeValueAsString(bodyMap);

        var headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Type", "application/json");
        headers.add("Authorization", "Bearer " + OPENAI_API_KEY);

        var entity = new org.springframework.http.HttpEntity<>(body, headers);

        var response = rest.postForEntity(
                "https://api.openai.com/v1/chat/completions",
                entity,
                String.class
        );

        JsonNode root = objectMapper.readTree(response.getBody());
        String content = root.path("choices").get(0).path("message").path("content").asText();

        JsonNode json = objectMapper.readTree(content);
        
        Map<String, String> result = new HashMap<>();
        result.put("segment", json.path("segment").asText());
        result.put("reason", json.path("reason").asText());

        return result;

    } catch (Exception e) {
        e.printStackTrace();
        Map<String, String> err = new HashMap<>();
        err.put("segment", "unknown");
        err.put("reason", "error occurred");
        return err;
    }
}

}
