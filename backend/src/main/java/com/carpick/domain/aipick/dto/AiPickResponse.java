package com.carpick.domain.aipick.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AiPickResponse {
    private String replyMessage;
    private String carType;
    private String carClass;          // 변환된 enum 이름 (영문)
    private List<AiCarCardDto> cars;  // 추천 차량 목록

}
