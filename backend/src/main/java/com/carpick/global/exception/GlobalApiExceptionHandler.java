package com.carpick.global.exception;

import java.nio.file.AccessDeniedException;
import java.sql.SQLException;

import org.springframework.dao.DataAccessException;
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
import com.carpick.global.helper.ApiRequestResolver;
import com.carpick.global.logging.SecurityLogger;
import com.carpick.global.response.ApiErrorResponse;
import com.carpick.global.response.ValidationErrorResponse;
import com.carpick.global.util.ProfileResolver;

import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalApiExceptionHandler {

	private final ProfileResolver profileResolver;
	private final ApiRequestResolver apiRequestResolver;
	
	/**
	 * 🔍 1. Validation 실패 – BindException (@ModelAttribute / Query Parameter)
	 * - 쿼리 파라미터 유효성 검증 실패
	 * - @ModelAttribute 객체 바인딩 오류
	 */
	@ExceptionHandler(BindException.class)
	protected ResponseEntity<ValidationErrorResponse> handleBindException(BindException e, HttpServletRequest request) {
		log.warn(
			    "[Global-BindException] path={}, errorCount={}",
			    request.getRequestURI(),
			    e.getBindingResult().getErrorCount()
			);

		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ValidationErrorResponse response =
			    ValidationErrorResponse.of(
			        errorCode,
			        e.getBindingResult(),
			        request,
			        profileResolver
			    );

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 2. Validation 실패 – MethodArgumentNotValidException (@RequestBody JSON)
	 * - @RequestBody JSON 데이터 유효성 검증 실패
	 * - @Valid 어노테이션으로 검증된 객체의 오류
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-MethodArgumentNotValid] path={}, errorCount={}",
			    request.getRequestURI(),
			    e.getBindingResult().getErrorCount()
			);

		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ValidationErrorResponse response =
			    ValidationErrorResponse.of(
			        errorCode,
			        e.getBindingResult(),
			        request,
			        profileResolver
			    );

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 3. 데이터베이스 관련 예외
	 * - JPA/Hibernate 오류 및 SQL 실행 실패
	 * - 데이터베이스 연결 문제 및 쿼리 오류
	 */
	@ExceptionHandler({ PersistenceException.class, DataAccessException.class, BadSqlGrammarException.class, SQLException.class })
	protected ResponseEntity<ApiErrorResponse> handleDatabaseException(Exception e, HttpServletRequest request) {
				
		SecurityLogger.error(
			    log,
			    profileResolver,
			    "[Global-DatabaseException] path={}",
			    request.getRequestURI(),
			    e
			);

		ErrorCode errorCode = ErrorCode.DATABASE_ERROR;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 4. 메서드 레벨 파라미터 검증 실패
	 * - @Validated 어노테이션으로 검증된 파라미터 오류
	 * - 메서드 레벨에서 직접 적용된 제약 조건 위반
	 */
	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-ConstraintViolationException] path={}, violationCount={}",
			    request.getRequestURI(),
			    e.getConstraintViolations().size()
			);

		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 5. 필수 HTTP 요청 파라미터 누락
	 * - @RequestParam(required=true) 파라미터 누락
	 * - 필수 쿼리 파라미터가 전달되지 않은 경우
	 */
	@ExceptionHandler(MissingServletRequestParameterException.class)
	protected ResponseEntity<ApiErrorResponse> handleMissingParameter(MissingServletRequestParameterException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-MissingParameter] path={}, parameter={}",
			    request.getRequestURI(),
			    e.getParameterName()
			);

		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 6. 타입 불일치 예외
 ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	 * - 숫자 필드에 문자열 전달 등
	 */
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	protected ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-TypeMismatch] path={}, parameter={}, requiredType={}",
			    request.getRequestURI(),
			    e.getName(),
			    e.getRequiredType() != null ? e.getRequiredType().getSimpleName() : "unknown"
			);


		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 7. JSON 파싱 실패
	 * - 잘못된 JSON 형식의 요청 본문
	 * - 읽을 수 없는 요청 데이터 형식
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-HttpMessageNotReadable] path={}",
			    request.getRequestURI()
			);

		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 8. API 요청에 대한 404 Not Found 처리
	 * - 존재하지 않는 API 엔드포인트 호출 시
	 * - 잘못된 URL 또는 매핑되지 않은 API 요청
	 */
	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ApiErrorResponse> handleApi404(
	        NoResourceFoundException e,
	        HttpServletRequest request
	) {
	    log.warn(
	    	    "[Global-NotFound] path={}",
	    	    request.getRequestURI()
	    	);

	    ErrorCode errorCode = ErrorCode.ENTITY_NOT_FOUND;
	    
	    ApiErrorResponse response =
	    	    ApiErrorResponse.of(errorCode, request, profileResolver);
	    
	    return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 9. 허용되지 않은 HTTP Method 예외
	 * - POST 요청을 GET으로 호출하는 경우
	 * - 지원하지 않는 HTTP 메서드 사용 시
	 */
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	protected ResponseEntity<ApiErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-MethodNotAllowed] path={}, method={}",
			    request.getRequestURI(),
			    request.getMethod()
			);

		ErrorCode errorCode = ErrorCode.METHOD_NOT_ALLOWED;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 10. 접근 거부 예외 처리 (Access Denied)
	 * - 권한이 없는 리소스 접근 시
	 * - 인증은 되었으나 권한이 부족한 경우
	 */
	@ExceptionHandler(AccessDeniedException.class)
	protected ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
		log.warn(
			    "[Global-AccessDenied] path={}",
			    request.getRequestURI()
			);

		ErrorCode errorCode = ErrorCode.FORBIDDEN;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 11. 지원하지 않는 미디어 타입 (Unsupported Content-Type)
	 * - 잘못된 Content-Type 헤더 전송 시
	 * - JSON 요청에 text/plain 등 잘못된 타입 사용
	 */
	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	protected ResponseEntity<ApiErrorResponse> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-MediaTypeNotSupported] path={}, contentType={}",
			    request.getRequestURI(),
			    request.getContentType()
			);

		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 12. 파일 업로드 크기 초과 예외 처리 (Max Upload Size Exceeded)
	 * - 설정된 최대 파일 크기를 초과한 업로드 시도
	 * - multipart/form-data 요청 크기 제한 초과
	 */
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	protected ResponseEntity<ApiErrorResponse> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e,
			HttpServletRequest request) {
		log.warn(
			    "[Global-MaxUploadSizeExceeded] path={}",
			    request.getRequestURI()
			);

		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
		
		ApiErrorResponse response =
			    ApiErrorResponse.of(errorCode, request, profileResolver);

		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	/**
	 * 🔍 13. 기타 모든 예외 (전역 처리)
	 * - 예상하지 못한 서버 내부 오류
	 * - 다른 핸들러에서 처리되지 않은 모든 예외
	 */
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<ApiErrorResponse> handleGlobalException(
	        Exception e,
	        HttpServletRequest request
	) throws Exception {

	    if (!apiRequestResolver.isApiRequest(request)) {
	        throw e;
	    }
	    
	    SecurityLogger.error(
	    	    log,
	    	    profileResolver,
	    	    "[Global-Exception] path={}",
	    	    request.getRequestURI(),
	    	    e
	    	);

	    ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
	    
	    ApiErrorResponse response =
	    	    ApiErrorResponse.of(errorCode, request, profileResolver);
	    
	    return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}
}