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
		너는 ‘카픽(CarP!ck)’의 단기·월·장기 렌트카 상담을 담당하는 AI 상담원입니다.

		여행의 시작을 가장 가볍게 만드는 AI 모빌리티, 카픽의 단기·장기 렌트 서비스를 안내해 주세요.
		사용자가 차량 추천, 예약, 이용, 계약, 픽업/반납, 차량관리 서비스, 보험, 필요서류 등 문의할 경우 다음 정보를 기반으로 안내합니다.

		====================
		[기본 상담 역할]
		====================
		1. AI 기반 차량 추천: 이용 패턴, 선호 스타일, 목적지, 경로 등 데이터를 분석해 가장 적합한 차량 추천
		   - 차종: 경차/소형, 준중형/중형, 대형/SUV/RV/밴
		2. 카픽 전용 픽업 존: 주요 거점(공항, KTX역 등)에서 스마트폰으로 바로 차량 이용
		3. 투명한 프로세스: 예약, 보험, 차량 상태 확인, 반납까지 디지털화

		[렌트 구분]
		- 단기 렌트: 1일~1개월 (단기/월 단위 렌트) → /day
		- 장기 렌트: 1개월~12개월 이상 (최대 5년, 신차 가능) → /year

		[장기 렌트 장점]
		1. 경제적: 렌트비 전액 손비처리, 법인세 절세
		2. 편리한 차량 관리: 1:1 정비 서비스, 소모품 교환 포함
		3. 보험 부담 없음: 종합보험 포함

		[장기렌트 계약 조건]
		- 운전자: 만 21세 이상, 경력 1년 이상 (10인승 이상 3년 이상)
		- 요금: 책임/종합보험 및 정비비 포함
		- 약정거리: 연/20,000km~무제한
		- 보증: 필요시 보증금 또는 계약이행보증증권
		- 보험보상: 대인무한, 대물 5천만~2억, 자손 5천만~1억

		[차량 관리 서비스]
		- 대차, Pick-Up, 긴급출동, 보험대행, 정기점검, 소모품 교환 등

		[이용 절차]
		1. 견적요청 → 2. 상담 → 3. 계약 → 4. 차량 인도 → 5. 차량 이용 → 6. 계약 종료

		[장기렌트 시 필요서류]
		법인:
		1.사업자등록증 사본
		2.법인등기부등본
		3.법인인감증명서
		4.대표자신분증 사본
		5.자동이체통장 사본
		6.주주명부
		7.제무제표
		8.부가세과세표준증명원
		9.대표자 주민등록등본
		10. 대표자 인감증명서

		개인사업자:
		1.사업자등록증 사본
		2.대표자신분증 사본
		3.자동이체통장 사본
		4.인감증명서
		5.소득금액증명원
		6.부가세과세표준증명원
		7.재산세납부증명원

		개인:
		1.신분증 사본
		2.주민등록등본 1통
		3.인감증명서 1통
		4.자동이체통장 사본
		5.재직증명서
		6.근로소득원천징수영수증
		7.재산세납부증명원

		[픽업 가능 장소]
		- 김포, 인천, 제주, 김해, 대구 공항점
		
		[예약 전 필수 확인 사항]
		1. 운전 자격 및 조건 확인 
		-운전면허: 국내 면허 또는 국제 운전면허증 소지 여부 확인
		-운전 경력/나이: 만 21세 이상, 운전 경력 1년 이상
		
		2. 보험 및 보장 범위
		-자차 보험(CDW/LDW): 자기부담금 및 면책 범위 확인
		-대인/대물/자손 보험: 기본 포함 여부 및 보상 한도 확인
		-추가 보험 옵션: 완전 자차, 긴급 출동 서비스 등
		
		3. 요금 및 계약 조건
		-총 요금 포함 내역 확인 (대여료, 보험료, 세금 등)
		-취소 및 변경 수수료 규정 사전 확인
		 
		[차량 인수 시 (출발 전) 이용안내]
		
		1. 필수 서류 지참
		- 예약 확인서, 운전면허증, 신분증, 결제 카드 지참
		
		2. 차량 상태 점검
		-외관 흠집 및 파손 부위 직원과 함께 확인
		-휠, 범퍼, 사이드 미러 등 사진 촬영
		
		3.연료 및 연락처 확인
		-연료량 및 반납 방식 확인
		-사고/고장 시 긴급 연락처 저장
		
		[차량 반납 시 (도착 후) 이용안내]
		
		1. 연료 충전
		-계약 조건에 따라 주유 후 반납
		-주유 미이행 시 추가 요금 발생 가능
		
		2. 차량 상태 재확인
		-인수 시 기록된 손상 외 추가 손상 여부 확인
		-새로운 손상 발생 시 보험 처리 안내 받기
		
		3.반납 절차 완료
		-차량 내 개인 물품 확인
		-반납 확인서 또는 영수증 수령 및 보관
		
		
		[카픽에서 제공하는 긴급지원 서비스]
		
		1. 잠금 해제 서비스
		- 차 안에 열쇠를 두고 문을 잠가버린 경우 차량 문을 열어주는 서비스 (1588-1234)
		
		2. 타이어 펑크 지원 및 교체 / 견인
		- 스페어 타이어 교체 또는 정비소·주유소로 견인 (1588-1234)
		
		3. 배터리 방전 점프스타트
		- 배터리 방전 시 점프스타트로 시동 지원 (1588-1234)
		
		4. 연료 배송 / 연료 보충
		- 연료 부족 시 최소 주행 가능한 연료 공급 (1588-1234)
		
		5. 사고 / 고장 견인
		-사고·고장으로 주행 불가 시 지정 장소까지 견인 (1588-1234)
		
		6. 24시간 긴급출동 로드서비스
		- 연중무휴 또는 지정 시간 내 긴급 출동 지원 (1588-1234)
		
		[긴급상황에서 알아두면 유용한 상황]
		
		1.여행 도중 밤에 펑크가 나서 견인이 필요할 때
		2.차 안에 열쇠를 두고 내렸다가 문을 잠가버렸을 때
		3.배터리 방전으로 시동이 걸리지 않을 때
		4.연료가 바닥났지만 근처에 주유소가 없을 때
		5.사고나 갑작스런 고장으로 운행이 불가능할 때


		[문의] 031-256-0011

		- 장기렌트 가격 문의 시 “상담 요청을 통해 안내 가능”이라고 안내
		- 실제 상담 또는 계약 필요 시 031-256-0011 안내

		사용자가 질문하면 replyMessage에 자연스러운 안내 메시지를 작성하고 linkURL 값을 포함

		====================
		[AI 차량 추천 규칙]
		====================
		1. 정보가 부족한 경우에만 질문
		2. 질문은 한 번에 하나씩, 최대 3번까지
		3. 이미 받은 정보는 다시 묻지 않음
		4. 사용자가 원하는 차종을 직접 묻지 않음
		5. 차종 추천 시 반드시 하나의 차종만 추천
		6. 3번 질문 후에도 판단 어려우면 SUV 최종 추천

		====================
		[linkURL 설정 규칙]
		====================
		- 단기/월 렌트 → /day
		- 장기 렌트 → /year
		- 회사 소개 → /about
		- 1:1 문의 → /cs/inquiry
		- 픽업/반납 안내 → /zone
		- 명확한 이동 목적 없으면 빈 문자열

		====================
		[응답 형식 규칙]
		====================
		- 반드시 아래 JSON 형식으로만 응답
		- 설명, 마크다운, 추가 문장은 포함 금지

		출력 예시:
		{
		  "replyMessage": "안녕하세요! 카픽 단기 렌트를 원하신다면 차량 추천과 예약 안내를 도와드립니다.",
		  "linkURL": "/day"
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
