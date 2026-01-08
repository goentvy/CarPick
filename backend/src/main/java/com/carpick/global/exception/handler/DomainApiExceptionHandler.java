package com.carpick.global.exception.handler;

import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.BusinessException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.response.ErrorResponse;
import com.carpick.global.logging.SecurityLogger;
import com.carpick.global.util.ProfileResolver;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Order(1)
@RestControllerAdvice(basePackages = {
        "com.carpick.domain",
        "com.carpick.test"
})
public class DomainApiExceptionHandler extends AbstractExceptionHandler {

    public DomainApiExceptionHandler(ProfileResolver profileResolver) {
        super(profileResolver);
    }

    /**
     * 🔍 1. AuthenticationException (인증 실패 예외)
     */
    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException e,
            HttpServletRequest request
    ) {
        ErrorCode errorCode = e.getErrorCode();

        log.error(
                "[AUTH-FAIL] code=" + errorCode +
                        ", path=" + request.getRequestURI(),
                e
        );

        return buildResponseEntity(
                errorCode,
                request,
                "아이디 또는 비밀번호가 일치하지 않습니다."
        );
    }


    /**
     * 🔍 2. BusinessException (비즈니스 로직 예외)
     */
    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException e,
            HttpServletRequest request
    ) {
        ErrorCode errorCode = e.getErrorCode();

        log.error(
                "[BUSINESS] code=" + errorCode +
                        ", path=" + request.getRequestURI(),
                e
        );

        return buildResponseEntity(
                errorCode,
                request,
                e.getMessage()
        );
    }

}

