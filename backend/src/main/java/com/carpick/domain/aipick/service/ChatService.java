package com.carpick.domain.aipick.service;

import org.springframework.stereotype.Service;

import com.carpick.domain.aipick.dto.ChatRequest;
import com.carpick.domain.aipick.dto.ChatResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final AiClient aiClient;

    public ChatResponse process(ChatRequest request) {

        ChatResponse response = aiClient.ask(request.getMessage());

        boolean canRecommend =
                response.getCarType() != null &&
                response.getRentType() != null;

        response.setCanRecommend(canRecommend);
        return response;
    }
}
