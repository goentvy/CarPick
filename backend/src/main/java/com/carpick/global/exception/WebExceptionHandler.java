package com.carpick.global.exception;

import java.nio.file.AccessDeniedException;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.carpick.global.enums.ErrorCode;
import com.carpick.global.helper.ApiRequestResolver;
import com.carpick.global.response.ErrorResponse;
import com.carpick.global.util.ProfileResolver;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class WebExceptionHandler {

	private final ProfileResolver profileResolver;
	private final ApiRequestResolver  apiRequestResolver;
	
	/**
	 * 🔍 1. Web 전용 최종 fallback 예외 처리
	 * - 모든 웹 예외의 최후 처리자
	 */
	@ExceptionHandler(Exception.class)
	public String handleWebException(
	        Exception e,
	        HttpServletRequest request,
	        Model model
	) {
	    String uri = request.getRequestURI();

	    // API 요청은 처리하지 않음
	    if (apiRequestResolver.isApiRequest(request)) {
	        return null;
	    }

	    log.error("[Web-Exception] path={}, exception={}",
	            uri,
	            e.getClass().getSimpleName(),
	            e
	    );

	    ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
	    
	    String message = errorCode.getMessageByProfile(profileResolver);

	    model.addAttribute(
	        "error",
	        ErrorResponse.of(
	        		errorCode.getCode(),
	        		message,
	                request.getRequestURI()
	        )
	    );

	    return "error/500";
	}

	/**
	 * 🔍 2. 웹 페이지 접근 거부 예외 처리 (Access Denied)
	 * - 권한이 없는 웹 페이지 접근 시
	 * - 403 에러 페이지로 리다이렉트
	 */
	@ExceptionHandler(AccessDeniedException.class)
	public String handleAccessDenied(
	        AccessDeniedException e,
	        HttpServletRequest request,
	        Model model
	) {
		if (apiRequestResolver.isApiRequest(request)) {
	        return null;
	    }

	    log.warn(
	    	    "[Web-AccessDenied] path={}, exception={}",
	    	    request.getRequestURI(),
	    	    e.getClass().getSimpleName()
	    	);

	    ErrorCode errorCode = ErrorCode.ACCESS_DENIED;
	    
	    String message = errorCode.getMessageByProfile(profileResolver);

	    model.addAttribute(
	        "error",
	        ErrorResponse.of(
	        		errorCode.getCode(),
	        		message,
	                request.getRequestURI()
	        )
	    );

	    return "error/403";
	}
	
}