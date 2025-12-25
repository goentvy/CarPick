package com.carpick.global.exception.handler;

import java.nio.file.AccessDeniedException;
import java.sql.SQLException;
import java.util.List;

import com.carpick.common.dto.CommonResponse;
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

import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.response.ErrorResponse;
import com.carpick.global.exception.response.FieldErrorDetail;
import com.carpick.global.exception.response.ValidationErrorResponse;
import com.carpick.global.helper.ApiRequestResolver;
import com.carpick.global.util.ProfileResolver;

import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalApiExceptionHandler extends AbstractExceptionHandler {

	public GlobalApiExceptionHandler(
            ProfileResolver profileResolver,
            ApiRequestResolver apiRequestResolver
    ) {
        super(profileResolver);
        this.apiRequestResolver = apiRequestResolver;
    }
	
	private final ApiRequestResolver apiRequestResolver;
	
	/**
	 * 🔹 HTTP 관련 예외 공통 처리
	 */
	private ResponseEntity<ErrorResponse> handleHttpException(
	        String exceptionType,
	        ErrorCode errorCode,
	        HttpServletRequest request,
	        Object... additionalInfo
	) {
	    logExpectedSpringException(exceptionType, errorCode, request, additionalInfo);
	    return buildResponseEntity(errorCode, request);
	}
	private ResponseEntity<ValidationErrorResponse> handleValidationException(
	        org.springframework.validation.BindingResult bindingResult,
	        HttpServletRequest request
	) {
	    ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
	    
	    List<FieldErrorDetail> errors = FieldErrorDetail.from(bindingResult);
	    
	    logExpectedSpringException(
	            "Validation",
	            errorCode,
	            request,
	            "errorCount=" + errors.size()
	    );
	    
	    return buildValidationResponseEntity(errorCode, bindingResult, request);
	}
	
	/**
	 * 🔍 1. Validation 실패 – BindException
	 * - @ModelAttribute / Query Parameter 바인딩 오류
	 */
	@ExceptionHandler(BindException.class)
	protected ResponseEntity<ValidationErrorResponse> handleBindException(
	        BindException e,
	        HttpServletRequest request
	) {
	    return handleValidationException(e.getBindingResult(), request);
	}

	/**
	 * 🔍 2. Validation 실패 – MethodArgumentNotValidException (@RequestBody JSON)
	 * - @RequestBody JSON 데이터 유효성 검증 실패
	 * - @Valid 어노테이션으로 검증된 객체의 오류
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValid(
	        MethodArgumentNotValidException e,
	        HttpServletRequest request
	) {
	    return handleValidationException(e.getBindingResult(), request);
	}


	/**
	 * 🔍 3. 데이터베이스 관련 예외
	 * - JPA/Hibernate 오류 및 SQL 실행 실패
	 * - 데이터베이스 연결 문제 및 쿼리 오류
	 */
	@ExceptionHandler({
        PersistenceException.class,
        DataAccessException.class,
        BadSqlGrammarException.class,
        SQLException.class
})
	protected ResponseEntity<ErrorResponse> handleDatabaseException(
        Exception e,
        HttpServletRequest request
) {
    ErrorCode errorCode = ErrorCode.DATABASE_ERROR;
    
    logUnexpectedSpringException("Database", e, request);
    
    return buildResponseEntity(errorCode, request);
}

	/**
	 * 🔍 4. 메서드 레벨 파라미터 검증 실패
	 * - @Validated 어노테이션으로 검증된 파라미터 오류
	 * - 메서드 레벨에서 직접 적용된 제약 조건 위반
	 */
	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<ErrorResponse> handleConstraintViolation(
	        ConstraintViolationException e,
	        HttpServletRequest request
	) {
	    ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
	    
	    logExpectedSpringException(
	            "ConstraintViolation",
	            errorCode,
	            request,
	            "violationCount=" + e.getConstraintViolations().size()
	    );
	    
	    return buildResponseEntity(errorCode, request);
	}

	/**
	 * 🔍 5. 필수 HTTP 요청 파라미터 누락
	 * - @RequestParam(required=true) 파라미터 누락
	 * - 필수 쿼리 파라미터가 전달되지 않은 경우
	 */
	@ExceptionHandler(MissingServletRequestParameterException.class)
	protected ResponseEntity<ErrorResponse> handleMissingParameter(
	        MissingServletRequestParameterException e,
	        HttpServletRequest request
	) {
	    ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
	    
	    logExpectedSpringException(
	            "MissingParameter",
	            errorCode,
	            request,
	            "parameter=" + e.getParameterName()
	    );
	    
	    return buildResponseEntity(errorCode, request);
	}

	/**
	 * 🔍 6. 타입 불일치 예외
	 * - 예상된 타입과 다른 값 전달 시
	 * - 숫자 필드에 문자열 전달 등
	 */
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	protected ResponseEntity<ErrorResponse> handleTypeMismatch(
	        MethodArgumentTypeMismatchException e,
	        HttpServletRequest request
	) {
	    String requiredType = e.getRequiredType() != null
	            ? e.getRequiredType().getSimpleName()
	            : "unknown";
	    
	    return handleHttpException(
	            "TypeMismatch",
	            ErrorCode.INVALID_INPUT_VALUE,
	            request,
	            "parameter=" + e.getName() + ", requiredType=" + requiredType
	    );
	}

	/**
	 * 🔍 7. JSON 파싱 실패
	 * - 잘못된 JSON 형식의 요청 본문
	 * - 읽을 수 없는 요청 데이터 형식
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(
	        HttpMessageNotReadableException e,
	        HttpServletRequest request
	) {
	    return handleHttpException(
	            "HttpMessageNotReadable",
	            ErrorCode.INVALID_INPUT_VALUE,
	            request
	    );
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
	    return handleHttpException(
	            "ApiNotFound",
	            ErrorCode.NOT_FOUND,
	            request
	    );
	}

	/**
	 * 🔍 9. 허용되지 않은 HTTP Method 예외
	 * - POST 요청을 GET으로 호출하는 경우
	 * - 지원하지 않는 HTTP 메서드 사용 시
	 */
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	protected ResponseEntity<ErrorResponse> handleMethodNotAllowed(
	        HttpRequestMethodNotSupportedException e,
	        HttpServletRequest request
	) {
	    return handleHttpException(
	            "MethodNotAllowed",
	            ErrorCode.METHOD_NOT_ALLOWED,
	            request,
	            "method=" + request.getMethod()
	    );
	}

	/**
	 * 🔍 10. 접근 거부 예외 처리 (Access Denied)
	 * - 권한이 없는 리소스 접근 시
	 * - 인증은 되었으나 권한이 부족한 경우
	 */
	@ExceptionHandler(AccessDeniedException.class)
	protected ResponseEntity<ErrorResponse> handleAccessDenied(
	        AccessDeniedException e,
	        HttpServletRequest request
	) {
	    return handleHttpException(
	            "AccessDenied",
	            ErrorCode.FORBIDDEN,
	            request
	    );
	}

	/**
	 * 🔍 11. 지원하지 않는 미디어 타입 (Unsupported Content-Type)
	 * - 잘못된 Content-Type 헤더 전송 시
	 * - JSON 요청에 text/plain 등 잘못된 타입 사용
	 */
	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	protected ResponseEntity<ErrorResponse> handleMediaTypeNotSupported(
	        HttpMediaTypeNotSupportedException e,
	        HttpServletRequest request
	) {
	    return handleHttpException(
	            "MediaTypeNotSupported",
	            ErrorCode.INVALID_INPUT_VALUE,
	            request,
	            "contentType=" + request.getContentType()
	    );
	}

	/**
	 * 🔍 12. 파일 업로드 크기 초과 예외 처리 (Max Upload Size Exceeded)
	 * - 설정된 최대 파일 크기를 초과한 업로드 시도
	 * - multipart/form-data 요청 크기 제한 초과
	 */
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	protected ResponseEntity<ErrorResponse> handleMaxUploadSizeExceeded(
	        MaxUploadSizeExceededException e,
	        HttpServletRequest request
	) {
	    return handleHttpException(
	            "MaxUploadSizeExceeded",
	            ErrorCode.INVALID_INPUT_VALUE,
	            request
	    );
	}

	/**
	 * 🔍 13. 기타 모든 예외 (전역 처리)
	 * - 예상하지 못한 서버 내부 오류
	 * - 다른 핸들러에서 처리되지 않은 모든 예외
	 */
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<ErrorResponse> handleGlobalException(
	        Exception e,
	        HttpServletRequest request
	) throws Exception {

	    // Web 요청이면 상위(WebExceptionHandler)로 위임
	    if (!apiRequestResolver.isApiRequest(request)) {
	        throw e;
	    }

	    ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
	    
	    logUnexpectedSpringException("Global", e, request);

	    return buildResponseEntity(errorCode, request);
	}

//**
//		* 🔍 비즈니스 로직 예외 (Soft Delete 참조 체크 등)
// * - 삭제 불가 상태, 중복 데이터 등
// */
	@ExceptionHandler(IllegalStateException.class)
	protected ResponseEntity<ErrorResponse> handleIllegalState(
			IllegalStateException e,
			HttpServletRequest request
	) {
		ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE; // 또는 적절한 에러코드

		logExpectedSpringException(
				"IllegalState",
				errorCode,
				request,
				"message=" + e.getMessage()
		);

		return buildResponseEntity(errorCode, request);
	}
}