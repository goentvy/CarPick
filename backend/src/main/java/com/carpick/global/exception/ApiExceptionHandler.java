package com.carpick.global.exception;

import java.nio.file.AccessDeniedException;
import java.sql.SQLException;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.carpick.global.enums.ErrorCode;
import com.carpick.global.response.ApiErrorResponse;
import com.carpick.global.response.ValidationErrorResponse;
import com.carpick.global.validation.ValidationErrorExtractor;

import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice(basePackages = "com.carpick.domain")
public class ApiExceptionHandler {

	/**
	 * 🔍 1. AuthenticationException (인증 실패 예외)
	 * - 로그인 실패 또는 인증 토큰 오류 시 발생
	 * - 사용자 인증이 필요한 상황에서 발생하는 예외
	 */
	@ExceptionHandler(AuthenticationException.class)
	protected ResponseEntity<ApiErrorResponse> handleAuthenticationException(AuthenticationException e, HttpServletRequest request) {

		log.warn("[API-AuthenticationException] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(ErrorCode.UNAUTHORIZED.code(), e.getMessage(), request.getRequestURI());

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	/**
	 * 🔍 2. BusinessException (사용자 정의 예외)
	 * - 비즈니스 로직 오류 시 명시적으로 발생시키는 예외
	 * - 사용자에게 명확한 오류 메시지 전달
	 */
	@ExceptionHandler(BusinessException.class)
	protected ResponseEntity<ApiErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {

		log.warn("[API-BusinessException] {} - {}", e.getErrorCode(), e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(e.getErrorCode().code(), e.getMessage(), request.getRequestURI());

		return ResponseEntity.status(e.getErrorCode().getHttpStatus()).body(response);
	}

	/**
	 * 🔍 3. Validation 실패 – BindException (@ModelAttribute / Query Parameter)
	 * - 쿼리 파라미터 유효성 검증 실패
	 * - @ModelAttribute 객체 바인딩 오류
	 */
	@ExceptionHandler(BindException.class)
	protected ResponseEntity<ValidationErrorResponse> handleBindException(BindException e, HttpServletRequest request) {

		log.warn("[API-BindException] {}", e.getMessage());

		ValidationErrorResponse response = ValidationErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				ErrorCode.INVALID_INPUT_VALUE.message(),
				ValidationErrorExtractor.extract(e.getBindingResult()),
				request.getRequestURI()
		);

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 4. Validation 실패 – MethodArgumentNotValidException (@RequestBody JSON)
	 * - @RequestBody JSON 데이터 유효성 검증 실패
	 * - @Valid 어노테이션으로 검증된 객체의 오류
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException e,
			HttpServletRequest request) {

		log.warn("[API-MethodArgumentNotValid] {}", e.getMessage());

		ValidationErrorResponse response = ValidationErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				ErrorCode.INVALID_INPUT_VALUE.message(),
				ValidationErrorExtractor.extract(e.getBindingResult()),
				request.getRequestURI()
		);

		return ResponseEntity.badRequest().body(response);
	}


	/**
	 * 🔍 5. 데이터베이스 관련 예외
	 * - JPA/Hibernate 오류 및 SQL 실행 실패
	 * - 데이터베이스 연결 문제 및 쿼리 오류
	 */
	@ExceptionHandler({ PersistenceException.class, DataAccessException.class, BadSqlGrammarException.class, SQLException.class })
	protected ResponseEntity<ApiErrorResponse> handleDatabaseException(Exception e, HttpServletRequest request) {
		
		log.error("[API-Database Error] {}", e.getMessage(), e);

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.DATABASE_ERROR.code(),
				ErrorCode.DATABASE_ERROR.message(),
				request.getRequestURI()
		);

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}

	/**
	 * 🔍 6. 메서드 레벨 파라미터 검증 실패
	 * - @Validated 어노테이션으로 검증된 파라미터 오류
	 * - 메서드 레벨에서 직접 적용된 제약 조건 위반
	 */
	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException e,
			HttpServletRequest request) {

		log.warn("[API-ConstraintViolationException] {}", e.getMessage());

		String message = e.getConstraintViolations().stream().findFirst()
				.map(violation -> violation.getMessage())
				.orElse(ErrorCode.INVALID_INPUT_VALUE.message());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				message,
				request.getRequestURI()
		);

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 7. 필수 HTTP 요청 파라미터 누락
	 * - @RequestParam(required=true) 파라미터 누락
	 * - 필수 쿼리 파라미터가 전달되지 않은 경우
	 */
	@ExceptionHandler(MissingServletRequestParameterException.class)
	protected ResponseEntity<ApiErrorResponse> handleMissingParameter(MissingServletRequestParameterException e,
			HttpServletRequest request) {

		log.warn("[API-MissingParameter] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				e.getParameterName() + " 파라미터가 필요합니다.",
				request.getRequestURI()
		);

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 8. 타입 불일치 예외
	 * - 예상된 타입과 다른 값 전달 시
	 * - 숫자 필드에 문자열 전달 등
	 */
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	protected ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e,
			HttpServletRequest request) {

		log.warn("[API-TypeMismatch] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				e.getName() + " 값의 타입이 올바르지 않습니다.",
				request.getRequestURI()
		);

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 9. JSON 파싱 실패
	 * - 잘못된 JSON 형식의 요청 본문
	 * - 읽을 수 없는 요청 데이터 형식
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException e,
			HttpServletRequest request) {

		log.warn("[API-HttpMessageNotReadable] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				"요청 본문을 읽을 수 없습니다.",
				request.getRequestURI()
		);

		return ResponseEntity.badRequest().body(response);
	}
	
	/**
	 * 🔍 10. API 요청에 대한 404 Not Found 처리
	 * - 존재하지 않는 API 엔드포인트 호출 시
	 * - 잘못된 URL 또는 매핑되지 않은 API 요청
	 */
	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ApiErrorResponse> handleApi404(
	        NoResourceFoundException e,
	        HttpServletRequest request
	) {
	    String uri = request.getRequestURI();

	    return ResponseEntity
	        .status(HttpStatus.NOT_FOUND)
	        .body(ApiErrorResponse.of(
	            ErrorCode.ENTITY_NOT_FOUND.code(),
	            "요청한 리소스를 찾을 수 없습니다.",
	            uri
	        ));
	}

	/**
	 * 🔍 11. 허용되지 않은 HTTP Method 예외
	 * - POST 요청을 GET으로 호출하는 경우
	 * - 지원하지 않는 HTTP 메서드 사용 시
	 */
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	protected ResponseEntity<ApiErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException e,
			HttpServletRequest request) {

		log.warn("[API-MethodNotAllowed] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.METHOD_NOT_ALLOWED.code(),
				ErrorCode.METHOD_NOT_ALLOWED.message(),
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
	}

	/**
	 * 🔍 12. 접근 거부 예외 처리 (Access Denied)
	 * - 권한이 없는 리소스 접근 시
	 * - 인증은 되었으나 권한이 부족한 경우
	 */
	@ExceptionHandler(AccessDeniedException.class)
	protected ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {

		log.warn("[API-AccessDenied] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.FORBIDDEN.code(),
				"접근 권한이 없습니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	}

	/**
	 * 🔍 13. 지원하지 않는 미디어 타입 (Unsupported Content-Type)
	 * - 잘못된 Content-Type 헤더 전송 시
	 * - JSON 요청에 text/plain 등 잘못된 타입 사용
	 */
	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	protected ResponseEntity<ApiErrorResponse> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException e,
			HttpServletRequest request) {

		log.warn("[API-MediaTypeNotSupported] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				"지원하지 않는 Content-Type입니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
	}

	/**
	 * 🔍 14. 파일 업로드 크기 초과 예외 처리 (Max Upload Size Exceeded)
	 * - 설정된 최대 파일 크기를 초과한 업로드 시도
	 * - multipart/form-data 요청 크기 제한 초과
	 */
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	protected ResponseEntity<ApiErrorResponse> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e,
			HttpServletRequest request) {

		log.warn("[API-MaxUploadSizeExceeded] {}", e.getMessage());

		ApiErrorResponse response = ApiErrorResponse.of(
				ErrorCode.INVALID_INPUT_VALUE.code(),
				"파일 크기가 제한을 초과했습니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
	}

	/**
	 * 🔍 15. 기타 모든 예외 (전역 처리)
	 * - 예상하지 못한 서버 내부 오류
	 * - 다른 핸들러에서 처리되지 않은 모든 예외
	 */
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<ApiErrorResponse> handleGlobalException(
	        Exception e,
	        HttpServletRequest request
	) throws Exception {
	    String uri = request.getRequestURI();

	    // API 요청이 아니면 다른 핸들러에 위임
	    if (!uri.startsWith("/api")) {
	        throw e;
	    }

	    log.error("[API-GlobalException] {} - {}", uri, e.getMessage(), e);

	    ApiErrorResponse response = ApiErrorResponse.of(
	            ErrorCode.INTERNAL_SERVER_ERROR.code(),
	            "서버 내부 오류가 발생했습니다.",
	            uri
	    );

	    return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(response);
	}

	
}