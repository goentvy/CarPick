package com.carpick.global.exception;

import java.nio.file.AccessDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

	/**
	 * 🔍 1. 허용되지 않은 HTTP Method 예외
	 * - POST 요청을 GET으로 호출하는 경우
	 * - 지원하지 않는 HTTP 메서드 사용 시
	 */
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	protected ResponseEntity<ErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException e,
			HttpServletRequest request) {

		log.warn("[Method Not Allowed] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.METHOD_NOT_ALLOWED.getCode(),
				ErrorCode.METHOD_NOT_ALLOWED.getMessage(), request.getRequestURI());

		return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
	}

	/**
	 * 🔍 2. 기타 모든 예외 (전역 처리)
	 * - 예상하지 못한 서버 내부 오류
	 * - 다른 핸들러에서 처리되지 않은 모든 예외
	 */
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<ErrorResponse> handleException(
	        Exception e,
	        HttpServletRequest request
	) throws Exception {
	    String uri = request.getRequestURI();

	    // API 요청이 아니면 Spring 기본 처리로 위임
	    if (!uri.startsWith("/api")) {
	        throw e;
	    }

	    log.error("[Global-Exception] {} - {}", uri, e.getMessage(), e);

	    ErrorResponse response = ErrorResponse.of(
	            ErrorCode.INTERNAL_SERVER_ERROR.getCode(),
	            "서버 내부 오류가 발생했습니다.",
	            uri
	    );

	    return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(response);
	}


	/**
	 * 🔍 3. 접근 거부 예외 처리 (Access Denied)
	 * - 권한이 없는 리소스 접근 시
	 * - 인증은 되었으나 권한이 부족한 경우
	 */
	@ExceptionHandler(AccessDeniedException.class)
	protected ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {

		log.warn("[Global-AccessDenied] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.FORBIDDEN.getCode(), "접근 권한이 없습니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	}

	/**
	 * 🔍 4. 지원하지 않는 미디어 타입 (Unsupported Content-Type)
	 * - 잘못된 Content-Type 헤더 전송 시
	 * - JSON 요청에 text/plain 등 잘못된 타입 사용
	 */
	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	protected ResponseEntity<ErrorResponse> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException e,
			HttpServletRequest request) {

		log.warn("[Global-MediaTypeNotSupported] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), "지원하지 않는 Content-Type입니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
	}

	/**
	 * 🔍 5. 파일 업로드 크기 초과 예외 처리 (Max Upload Size Exceeded)
	 * - 설정된 최대 파일 크기를 초과한 업로드 시도
	 * - multipart/form-data 요청 크기 제한 초과
	 */
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	protected ResponseEntity<ErrorResponse> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e,
			HttpServletRequest request) {

		log.warn("[Global-MaxUploadSizeExceeded] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), "파일 크기가 제한을 초과했습니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
	}
	
//	/**
//	 * 🔍 404 Not Found (전역 처리) -> ApiExceptionHandler에 분리했으나 잠시 삭제 보류중
//	 */
//	@ExceptionHandler(NoResourceFoundException.class)
//	protected ResponseEntity<ErrorResponse> handleNoResourceFound(
//	        NoResourceFoundException e,
//	        HttpServletRequest request
//	) {
//	    String uri = request.getRequestURI();
//
//	    // API 요청만 처리
//	    if (!uri.startsWith("/api")) {
//	        return null; // Spring 기본 404 처리로 넘김
//	    }
//
//	    log.warn("[Global-NoResourceFound] {} - {}", uri, e.getMessage());
//
//	    ErrorResponse response = ErrorResponse.of(
//	            ErrorCode.ENTITY_NOT_FOUND.getCode(),
//	            "요청한 리소스를 찾을 수 없습니다.",
//	            uri
//	    );
//
//	    return ResponseEntity
//	            .status(HttpStatus.NOT_FOUND)
//	            .body(response);
//	}
	
}