package com.carpick.global.security.handler;

import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.response.ErrorResponse;
import com.carpick.global.util.ProfileResolver;
import com.fasterxml.jackson.databind.ObjectMapper; // JSON 변환용
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ProfileResolver profileResolver;
    private final ObjectMapper objectMapper; // Spring에 등록된 빈 사용

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");

        // ✅ 정적 팩토리 메서드 'of'를 사용하여 일관된 에러 응답 생성
        ErrorResponse errorResponse = ErrorResponse.of(
                ErrorCode.FORBIDDEN,
                request,
                profileResolver
        );

        // ✅ ObjectMapper를 사용해 레코드를 깔끔하게 JSON으로 직렬화
        String json = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(json);
    }
}