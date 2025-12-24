package com.carpick.global.security.handler;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.response.ErrorResponse;
import com.carpick.global.logging.SecurityLogger;
import com.carpick.global.util.ProfileResolver;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 🔐 JWT AccessDeniedHandler
 *
 * Spring Security Filter 단계에서 발생하는 "인가 실패(403)"를 처리한다.
 *
 * ✔ 처리 대상
 * - 인증은 완료되었으나(Authentication 성공)
 * - 요청한 리소스에 대한 권한이 없는 경우
 *   (ex. ROLE_USER로 ROLE_ADMIN API 접근)
 *
 * ✔ 처리 위치
 * - Controller 진입 이전
 * - Security Filter Chain 내부
 *
 * ⚠ 주의 사항 (중요)
 * - ControllerAdvice(@ExceptionHandler)에서 처리하는 AccessDeniedException과는 역할이 다르다.
 * - 이 Handler는 Security Filter 단계에서 발생한 AccessDeniedException만 처리한다.
 * - Controller 내부에서 발생한 AccessDeniedException은
 *   GlobalApiExceptionHandler에서 처리된다.
 *
 * 👉 설계 의도
 * - "Security 예외는 Security에서, API 예외는 ControllerAdvice에서" 처리한다.
 * - Security 계층과 MVC 계층의 책임 경계를 명확히 분리하기 위함이다.
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;
    private final ProfileResolver profileResolver;

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException ex
    ) throws IOException {

        ErrorCode errorCode = ErrorCode.ACCESS_DENIED;

        // 🔐 인가 실패 로그 (LOG 메시지)
        SecurityLogger.error(
                log,
                profileResolver,
                "[Security-AccessDenied] path={}",
                request.getRequestURI(),
                ex
        );

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType("application/json;charset=UTF-8");

        ErrorResponse errorResponse = ErrorResponse.of(
                errorCode,
                request,
                profileResolver
        );

        response.getWriter().write(
                objectMapper.writeValueAsString(errorResponse)
        );
    }
}


