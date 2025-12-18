package com.carpick.global.exception;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.carpick.global.enums.ErrorCode;
import com.carpick.global.response.ApiErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Order(1)
@RestControllerAdvice(basePackages = {
		"com.carpick.domain",
		"com.carpick.test"
})
public class DomainApiExceptionHandler {

	/**
	 * 🔍 1. AuthenticationException (인증 실패 예외)
	 * - 로그인 실패 또는 인증 토큰 오류 시 발생
	 * - 사용자 인증이 필요한 상황에서 발생하는 예외
	 */
	@ExceptionHandler(AuthenticationException.class)
	protected ResponseEntity<ApiErrorResponse> handleAuthenticationException(
	        AuthenticationException e, HttpServletRequest request) {

	    log.info("[Auth-Fail] code={}, path={}",
	            e.getErrorCode(),
	            request.getRequestURI());

	    ApiErrorResponse response = ApiErrorResponse.of(
	        e.getErrorCode().code(),
	        e.getErrorCode().message(),
	        request.getRequestURI()
	    );

	    return ResponseEntity
	        .status(e.getErrorCode().getHttpStatus())
	        .body(response);
	}



	/**
	 * 🔍 2. BusinessException (사용자 정의 예외)
	 * - 비즈니스 로직 오류 시 명시적으로 발생시키는 예외
	 * - 사용자에게 명확한 오류 메시지 전달
	 */
	@ExceptionHandler(BusinessException.class)
	protected ResponseEntity<ApiErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {
		log.warn("[Domain-BusinessException] {} - {}", e.getErrorCode(), e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(e.getErrorCode().code(), e.getMessage(), request.getRequestURI());

		return ResponseEntity.status(e.getErrorCode().getHttpStatus()).body(response);
	}
}