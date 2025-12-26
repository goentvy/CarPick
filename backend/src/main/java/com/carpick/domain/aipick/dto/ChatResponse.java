package com.carpick.domain.aipick.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class ChatResponse {

    private String replyMessage;

    private String rentType;   
    private String carType;

    private boolean canRecommend;
}
