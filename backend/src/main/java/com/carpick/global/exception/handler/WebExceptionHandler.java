package com.carpick.global.exception.handler;

import java.nio.file.AccessDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.carpick.global.exception.BaseException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.response.ErrorResponse;
import com.carpick.global.util.ProfileResolver;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice(annotations = Controller.class)
public class WebExceptionHandler extends AbstractExceptionHandler {

	public WebExceptionHandler(ProfileResolver profileResolver) {
        super(profileResolver);
    }
	
    /**
     * 🔍 1. 웹 전용 BaseException 처리
     * - 의도된 예외
     * - ErrorCode 정책 기반 메시지 사용
     */
    @ExceptionHandler(BaseException.class)
    public String handleBaseWebException(
            BaseException e,
            HttpServletRequest request,
            Model model
    ) {
        // ✅ 의도된 예외 → warn (LOG 메시지)
        logExpectedException(e, request);

        model.addAttribute(
                "error",
                buildErrorResponse(e, request)
        );

        return resolveErrorView(e.getHttpStatus());
    }

    /**
     * 🔍 2. 웹 페이지 접근 거부 (403)
     * - Security 필터를 통과한 경우에만 도달
     */
    @ExceptionHandler(AccessDeniedException.class)
    public String handleAccessDenied(
            AccessDeniedException e,
            HttpServletRequest request,
            Model model
    ) {
        ErrorCode errorCode = ErrorCode.ACCESS_DENIED;
        
        logExpectedSpringException(
                "AccessDenied",
                errorCode,
                request
        );

        model.addAttribute(
                "error",
                buildErrorResponse(errorCode, request)
        );

        return "error/403";
    }

    /**
     * 🔍 3. 웹 최종 fallback (예상 못 한 예외)
     */
    @ExceptionHandler(Exception.class)
    public String handleWebException(
            Exception e,
            HttpServletRequest request,
            Model model
    ) {
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        
        logUnexpectedException(e, request);

        model.addAttribute(
                "error",
                buildErrorResponse(errorCode, request)
        );

        return "error/500";
    }

    /**
     * HttpStatus → error view 매핑
     */
    private String resolveErrorView(HttpStatus status) {
        if (status == HttpStatus.FORBIDDEN) {
            return "error/403";
        }
        if (status == HttpStatus.NOT_FOUND) {
            return "error/404";
        }
        return "error/500";
    }
}



