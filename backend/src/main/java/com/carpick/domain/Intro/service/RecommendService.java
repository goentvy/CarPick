package com.carpick.domain.Intro.service;

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
    		    - 경차(LIGHT)
    		    - 소형(LIGHT)
    		    - 준중형(COMPACT)
    		    - 중형(MID)
    		    - SUV(SUV)
    		    - RV(RV)

    		    사용자가 선택한 정보:
    		    %s

    		    출력 형식:
    		    추천 이유는 다음 3단 구성으로 만들어줘:
    		    ① 상황 설명 모듈 (한 문장)
    		    ② 제안 모듈 (한 문장)
    		    ③ 이유 모듈 (한 문장)

    		    예시는 아래와 같은 형식이야:

    		    예시 1)
    		    장거리 이동이 많으시다면, 
    		    이런 차는 어떠세요? 
    		    승차감이 부드러워 장거리에서도 편안해요.

    		    예시 2)
    		    짐이 많은 여행이라면, 
    		    이 모델도 잘 맞으실 것 같아요. 
    		    적재공간이 넉넉해 움직임이 편해요.

    		    예시 3)
    		    도심 위주로 운전하신다면,
    		    이 차종을 한 번 고려해보셔도 좋아요.
    		    연비와 조작성이 좋아요.

    		    예시 4)
    		    가족과 함께 이동하신다면,
    		    이런 타입의 차량은 어떠신가요?
    		    안정감과 공간 모두 충분해요.

    		    **반드시 위와 동일한 구조와 동일한 분량, 동일한 톤으로 reason을 생성해줘.**
    		    각 문장은 줄바꿈(\\n)으로 구분해줘.

    		    **출력 JSON 형식으로만 응답해줘, 다른 텍스트는 쓰지 마:** 
    		    {{
    		      "segment": "추천된 차종의 영문값",
    		      "reason": "상황 설명\\n제안\\n이유"
    		    }}
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