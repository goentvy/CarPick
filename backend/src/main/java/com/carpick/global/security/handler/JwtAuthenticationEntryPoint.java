package com.carpick.global.security.handler;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.carpick.global.enums.ErrorCode;
import com.carpick.global.response.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * JWT 인증 실패 시 처리하는 핸들러
 * 인증되지 않은 요청에 대해 401 Unauthorized 응답 반환
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint
        implements AuthenticationEntryPoint {
	
    private final ObjectMapper objectMapper;

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
    	ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

    	response.setStatus(errorCode.getHttpStatus().value());
    	response.setContentType("application/json;charset=UTF-8");

    	response.getWriter().write(
    		    objectMapper.writeValueAsString(
    		        ErrorResponse.of(errorCode, request.getRequestURI())
    		    )
    		);
    }
}
