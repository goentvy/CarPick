package com.carpick.global.exception;

import java.sql.SQLException;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice(basePackages = "com.carpick.domain")
public class ApiExceptionHandler {

	/**
	 * 🔍 1. BusinessException (사용자 정의 예외)
	 * - 비즈니스 로직 오류 시 명시적으로 발생시키는 예외
	 * - 사용자에게 명확한 오류 메시지 전달
	 */
	@ExceptionHandler(BusinessException.class)
	protected ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {

		log.warn("[API-BusinessException] {} - {}", e.getErrorCode(), e.getMessage());

		ErrorResponse response = ErrorResponse.of(e.getErrorCode().getCode(), e.getMessage(), request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 2. Validation 실패 – BindException (@ModelAttribute / Query Parameter)
	 * - 쿼리 파라미터 유효성 검증 실패
	 * - @ModelAttribute 객체 바인딩 오류
	 */
	@ExceptionHandler(BindException.class)
	protected ResponseEntity<ErrorResponse> handleBindException(BindException e, HttpServletRequest request) {

		log.warn("[API-BindException] {}", e.getMessage());

		String message;
		if (e.getBindingResult().getFieldError() != null) {
			String defaultMessage = e.getBindingResult().getFieldError().getDefaultMessage();
			if (defaultMessage != null && defaultMessage.contains("Failed to convert")) {
				String fieldName = e.getBindingResult().getFieldError().getField();
				message = fieldName + " 값이 올바르지 않습니다.";
			} else {
				message = defaultMessage;
			}
		} else {
			message = ErrorCode.INVALID_INPUT_VALUE.getMessage();
		}

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), message, request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 3. Validation 실패 – MethodArgumentNotValidException (@RequestBody JSON)
	 * - @RequestBody JSON 데이터 유효성 검증 실패
	 * - @Valid 어노테이션으로 검증된 객체의 오류
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException e,
			HttpServletRequest request) {

		log.warn("[API-MethodArgumentNotValid] {}", e.getMessage());

		String message;
		if (e.getBindingResult().getFieldError() != null) {
			String defaultMessage = e.getBindingResult().getFieldError().getDefaultMessage();
			if (defaultMessage != null && defaultMessage.startsWith("must not be blank")) {
				String fieldName = e.getBindingResult().getFieldError().getField();
				message = fieldName + "은(는) 필수입니다.";
			} else if (defaultMessage != null && defaultMessage.startsWith("must be greater than")) {
				String fieldName = e.getBindingResult().getFieldError().getField();
				message = fieldName + " 값이 올바르지 않습니다.";
			} else {
				message = defaultMessage != null ? defaultMessage : "입력값이 올바르지 않습니다.";
			}
		} else {
			message = "입력값이 올바르지 않습니다.";
		}

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), message,
				request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 4. 데이터베이스 관련 예외
	 * - JPA/Hibernate 오류 및 SQL 실행 실패
	 * - 데이터베이스 연결 문제 및 쿼리 오류
	 */
	@ExceptionHandler({ PersistenceException.class, DataAccessException.class, BadSqlGrammarException.class, SQLException.class })
	protected ResponseEntity<ErrorResponse> handleDatabaseException(Exception e, HttpServletRequest request) {

		log.error("[API-Database Error] {}", e.getMessage(), e);

		ErrorResponse response = ErrorResponse.of("D001", "데이터베이스 처리 중 오류가 발생했습니다.", request.getRequestURI());

		return ResponseEntity.internalServerError().body(response);
	}

	/**
	 * 🔍 5. 메서드 레벨 파라미터 검증 실패
	 * - @Validated 어노테이션으로 검증된 파라미터 오류
	 * - 메서드 레벨에서 직접 적용된 제약 조건 위반
	 */
	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException e,
			HttpServletRequest request) {

		log.warn("[API-ConstraintViolationException] {}", e.getMessage());

		String message = e.getConstraintViolations().stream().findFirst()
				.map(violation -> {
					String originalMessage = violation.getMessage();
					if (originalMessage.startsWith("must not be blank")) {
						return "값이 비어있을 수 없습니다.";
					} else if (originalMessage.startsWith("must be greater than")) {
						return "값이 올바르지 않습니다.";
					}
					return originalMessage;
				})
				.orElse("입력값이 올바르지 않습니다.");

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), message,
				request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 6. 필수 HTTP 요청 파라미터 누락
	 * - @RequestParam(required=true) 파라미터 누락
	 * - 필수 쿼리 파라미터가 전달되지 않은 경우
	 */
	@ExceptionHandler(MissingServletRequestParameterException.class)
	protected ResponseEntity<ErrorResponse> handleMissingParameter(MissingServletRequestParameterException e,
			HttpServletRequest request) {

		log.warn("[API-MissingParameter] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(),
				e.getParameterName() + " 파라미터가 필요합니다.", request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 7. 타입 불일치 예외
	 * - 예상된 타입과 다른 값 전달 시
	 * - 숫자 필드에 문자열 전달 등
	 */
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	protected ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e,
			HttpServletRequest request) {

		log.warn("[API-TypeMismatch] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(),
				e.getName() + " 값의 타입이 올바르지 않습니다.", request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 8. JSON 파싱 실패
	 * - 잘못된 JSON 형식의 요청 본문
	 * - 읽을 수 없는 요청 데이터 형식
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException e,
			HttpServletRequest request) {

		log.warn("[API-HttpMessageNotReadable] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), "요청 본문을 읽을 수 없습니다.",
				request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}
	
	/**
	 * 🔍 8. API 요청에 대한 404 Not Found 처리
	 * - 존재하지 않는 API 엔드포인트 호출 시
	 * - 잘못된 URL 또는 매핑되지 않은 API 요청
	 */
	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ErrorResponse> handleApi404(
	        NoResourceFoundException e,
	        HttpServletRequest request
	) {
	    String uri = request.getRequestURI();

	    return ResponseEntity
	        .status(HttpStatus.NOT_FOUND)
	        .body(ErrorResponse.of(
	            ErrorCode.ENTITY_NOT_FOUND.getCode(),
	            "요청한 리소스를 찾을 수 없습니다.",
	            uri
	        ));
	}

	
}
