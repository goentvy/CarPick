package com.carpick.global.exception;

import java.nio.file.AccessDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.carpick.global.enums.ErrorCode;
import com.carpick.global.response.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class WebExceptionHandler {

	/**
	 * 🔍 1. 웹 페이지 전용 예외 처리
	 * - 웹 페이지 요청에서 발생하는 모든 예외
	 * - 에러 페이지로 리다이렉트
	 */
	@ExceptionHandler(Exception.class)
	public String handleWebException(
	        Exception e,
	        HttpServletRequest request,
	        Model model
	) {
	    String uri = request.getRequestURI();

	    // API 요청은 처리하지 않음
	    if (uri.startsWith("/api")) {
	        return null;
	    }

	    log.error("[Web-Exception] {} - {}", uri, e.getMessage(), e);

	    ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

	    model.addAttribute(
	        "error",
	        ErrorResponse.of(
	            errorCode.message(),
	            request.getRequestURI()
	        )
	    );

	    return "error/500";
	}

	@ExceptionHandler(AccessDeniedException.class)
	public String handleAccessDenied(
	        AccessDeniedException e,
	        HttpServletRequest request,
	        Model model
	) {
	    if (request.getRequestURI().startsWith("/api")) {
	        return null;
	    }

	    log.warn("[Web-403] {}", request.getRequestURI());

	    model.addAttribute(
	        "error",
	        ErrorResponse.of(
	            ErrorCode.ACCESS_DENIED.message(),
	            request.getRequestURI()
	        )
	    );

	    return "error/403";
	}
	
	@ExceptionHandler(NoHandlerFoundException.class)
	public String handleNotFound(
	        NoHandlerFoundException e,
	        HttpServletRequest request,
	        Model model
	) {
	    if (request.getRequestURI().startsWith("/api")) {
	        return null;
	    }

	    log.warn("[Web-404] {}", request.getRequestURI());

	    model.addAttribute(
	        "error",
	        ErrorResponse.of(
	            ErrorCode.NOT_FOUND.message(),
	            request.getRequestURI()
	        )
	    );

	    return "error/404";
	}

	@ExceptionHandler(ResponseStatusException.class)
	public String handleResponseStatusException(
	        ResponseStatusException e,
	        HttpServletRequest request,
	        Model model
	) {
	    if (request.getRequestURI().startsWith("/api")) {
	        return null;
	    }

	    HttpStatusCode statusCode = e.getStatusCode();

	    ErrorCode errorCode;
	    if (statusCode.value() == HttpStatus.FORBIDDEN.value()) {
	        errorCode = ErrorCode.ACCESS_DENIED;
	    } else if (statusCode.value() == HttpStatus.NOT_FOUND.value()) {
	        errorCode = ErrorCode.NOT_FOUND;
	    } else {
	        errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
	    }

	    model.addAttribute(
	        "error",
	        ErrorResponse.of(
	            errorCode.message(),
	            request.getRequestURI()
	        )
	    );

	    return "error/" + statusCode.value();
	}

	
}