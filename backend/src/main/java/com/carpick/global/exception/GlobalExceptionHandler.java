package com.carpick.global.exception;

import java.nio.file.AccessDeniedException;

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

import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	/**
	 * 🔍 BusinessException (사용자 정의 예외)
	 * 
	 * 비즈니스 요구사항 또는 도메인 규칙 위반 시 서비스 코드에서 던지는 커스텀 예외를 처리한다.
	 * 
	 * 예: 회원이 이미 가입되어 있을 때 중복 가입을 막기 위해 throw new
	 * BusinessException(ErrorCode.DUPLICATE_RESOURCE)
	 * 
	 * 특징: - 클라이언트 요청 자체의 형식(Validation)보다 도메인/업무 규칙의 위반을 의미. - 보통 ErrorCode에 정의된
	 * code/message를 그대로 사용해 응답함.
	 */
	@ExceptionHandler(BusinessException.class)
	protected ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {

		log.warn("[BusinessException] {} - {}", e.getErrorCode(), e.getMessage());

		ErrorResponse response = ErrorResponse.of(e.getErrorCode().getCode(), e.getMessage(), request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/** - 바인딩 단계 검증 실패 -
	 * 🔍 Validation 실패 – BindException (@ModelAttribute / Query Parameter)
	 *
	 * ✔ 언제 발생? - JSON(@RequestBody)이 아닌 요청에서 검증이 실패할 때 발생한다. - 즉, "요청 파라미터 바인딩
	 * 단계"에서 타입 불일치 또는 제약조건 위반이 일어난 경우.
	 *
	 * ✔ 발생 상황 예: - GET /search?page=abc → page=int인데 "abc"라서 바인딩 단계에서 오류 발생
	 * - @ModelAttribute DTO에 @Valid 사용했는데 필드 검증 실패 - 폼 데이터(Form-Data) 바인딩 중 검증 오류
	 * 발생
	 *
	 * ✔ 왜 MethodArgumentNotValidException과 다른가? - JSON 요청이 아니라면
	 * HttpMessageConverter가 동작하지 않음. - 따라서 DTO 변환 후 검증이 아니라, "바인딩 과정"에서 즉시 오류가 발생 →
	 * BindException.
	 *
	 * ✔ 처리 방식: - BindingResult에서 FieldError를 추출해 메시지를 생성. - 오류 메시지가 없으면 기본
	 * INVALID_INPUT_VALUE 메시지 사용.
	 *
	 * ⚠ 주의: - 같은 @Valid라도 @RequestBody JSON이면 BindException이 아니라
	 * MethodArgumentNotValidException이 발생하므로 둘 다 처리해야 완전한 검증 처리 가능.
	 */
	@ExceptionHandler(BindException.class)
	protected ResponseEntity<ErrorResponse> handleBindException(BindException e, HttpServletRequest request) {

		log.warn("[BindException] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(),
				e.getBindingResult().getFieldError() != null ? e.getBindingResult().getFieldError().getDefaultMessage()
						: ErrorCode.INVALID_INPUT_VALUE.getMessage(),
				request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}
	
	/** - JSON 검증 실패 -
	 * 🔍 Validation 실패 – MethodArgumentNotValidException (@RequestBody JSON)
	 *
	 * ✔ 언제 발생? - @RequestBody DTO가 JSON → 객체 변환된 이후,
	 * 
	 * @Valid 검증이 실패하면 이 예외가 발생한다.
	 *
	 *        ✔ 발생 상황 예: - POST /users body: {"age": ""} → @NotBlank, @Min 등 검증 실패 -
	 *        JSON은 형식은 맞지만 필드 값이 제약조건을 위반한 경우
	 *
	 *        ✔ BindException과의 차이: - JSON 요청은 먼저 HttpMessageConverter로 DTO 변환이
	 *        이루어지고, 그 후 Bean Validation에서 오류가 나기 때문에
	 *        MethodArgumentNotValidException 발생. - 즉, "JSON 전용" 검증 오류 예외.
	 *
	 *        ✔ 처리 방식: - BindingResult에서 FieldError를 읽어 사용자 메시지를 구성.
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException e,
			HttpServletRequest request) {

		log.warn("[MethodArgumentNotValid] {}", e.getMessage());

		String message = e.getBindingResult().getFieldError() != null
				? e.getBindingResult().getFieldError().getDefaultMessage()
				: ErrorCode.INVALID_INPUT_VALUE.getMessage();

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), message,
				request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 MyBatis / SQL Exception
	 * 
	 * MyBatis, JDBC, DataSource 관련 예외들을 포괄적으로 처리한다. - PersistenceException:
	 * MyBatis에서 매핑/실행 오류 발생 시 던짐. - DataAccessException: Spring의 데이터 접근 계층 예외
	 * 추상화(모든 JDBC 관련 예외의 상위 타입). - BadSqlGrammarException: SQL 문법 오류 등.
	 *
	 * 처리 방식: - 내부 에러(데이터베이스/SQL 문제)이므로 클라이언트에는 일반화된 에러 코드와 메시지로 응답(500). - 상세한 예외
	 * 메시지/스택트레이스는 서버 로그에 남기고, 외부에 노출하지 않음(보안/정보 노출 방지).
	 *
	 * 운영 팁: - 운영 환경에서는 DB 연결 실패/쿼리 에러에 대해 알림(모니터링) 설정을 해두는 것이 좋음. - 재시도 로직이 필요한
	 * 작업(특정 transient 오류)인지 판단 후 처리.
	 */
	@ExceptionHandler({ PersistenceException.class, DataAccessException.class, BadSqlGrammarException.class })
	protected ResponseEntity<ErrorResponse> handleDatabaseException(Exception e, HttpServletRequest request) {

		log.error("[Database Error] {}", e.getMessage(), e);

		ErrorResponse response = ErrorResponse.of(ErrorCode.DATABASE_ERROR.getCode(),
				ErrorCode.DATABASE_ERROR.getMessage(), request.getRequestURI());

		return ResponseEntity.internalServerError().body(response);
	}

	/**
	 * 🔍 허용되지 않은 HTTP Method 예외
	 * 
	 * 허용되지 않은 HTTP 메서드로 요청이 들어온 경우 발생하는 예외를 처리한다. 예: 컨트롤러가 @PostMapping("/api") 인데
	 * 클라이언트가 GET으로 호출하면 HttpRequestMethodNotSupportedException 발생.
	 *
	 * 처리 방식: - 클라이언트의 요청 방식이 잘못됐음을 알리는 405 Method Not Allowed 반환. - 응답 메시지는 고정된
	 * ErrorCode 메시지를 사용(추가로 e.getSupportedMethods()로 허용 메서드 안내 가능).
	 *
	 * 개선 아이디어: - 응답에 허용되는 메서드 리스트를 포함시켜 클라이언트가 올바른 호출 방법을 알도록 할 수 있음.
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
	 * 🔍 기타 모든 예외
	 * 
	 * 애플리케이션 전역에서 잡히지 않은 모든 예외의 "최후의 보루"로 동작한다. - 개발 중 예기치 않은 NPE,
	 * IllegalStateException 등 모든 종류의 예외를 여기에서 잡아 로깅 후 500을 반환. - 이 핸들러는 구체적인 예외
	 * 핸들러보다 낮은 우선순위를 가지므로, 앞의 핸들러에서 잡히지 않은 경우에만 호출됨.
	 *
	 * 처리 방식: - 민감한 정보 노출 금지: e.getMessage()는 로그에 남기되, 클라이언트에는 일반화된 에러 메시지와 코드만 전달.
	 * - 운영 환경에서는 에러를 Sentry/Prometheus 등으로 전송해 모니터링/알림 설정 권장.
	 */
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest request) {

		log.error("[Unhandled Exception] {}", e.getMessage(), e);

		ErrorResponse response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR.getCode(),
				ErrorCode.INTERNAL_SERVER_ERROR.getMessage(), request.getRequestURI());

		return ResponseEntity.internalServerError().body(response);
	}

	/**
	 * 🔍 메서드 레벨 파라미터 검증에 대한 검증 실패 예외
	 * 
	 * @RequestParam, @PathVariable, @Validated 등을 사용한 "메서드 파라미터 검증"에서 제약
	 * 조건(@NotBlank, @Min 등)이 위반되면 발생하는 예외를 처리한다. 예: GET /api/test?id=0 에서
	 * id에 @Min(1) 적용 시 0 → ConstraintViolationException 발생
	 */
	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException e,
			HttpServletRequest request) {

		log.warn("[ConstraintViolationException] {}", e.getMessage());

		String message = e.getConstraintViolations().stream().findFirst().map(violation -> violation.getMessage())
				.orElse(ErrorCode.INVALID_INPUT_VALUE.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), message,
				request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 필수 HTTP 요청 파라미터 누락 예외
	 * 
	 * HTTP 요청에서 필수 파라미터(@RequestParam)가 누락된 경우 발생하는 예외를 처리한다. 예: GET /search?page=1
	 * 에서 size 파라미터가 빠진 경우 발생. Spring이 던지는 기본 메시지를 사용하거나, 파라미터명을 이용해 "xxx 파라미터가
	 * 필요합니다." 형태로 메시지를 구성한다.
	 **/
	@ExceptionHandler(MissingServletRequestParameterException.class)
	protected ResponseEntity<ErrorResponse> handleMissingParameter(MissingServletRequestParameterException e,
			HttpServletRequest request) {

		log.warn("[MissingParameter] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(),
				e.getParameterName() + " 파라미터가 필요합니다.", request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}


	/**
	 * 🔍 타입 불일치 예외 (Method Argument Type Mismatch)
	 *
	 * 설명 (한국어) - 컨트롤러의 파라미터 타입과 클라이언트가 보낸 값의 타입이 맞지 않을 때 발생. - 예: @RequestParam int
	 * age 인데 클라이언트가 age=abc 처럼 숫자가 아닌 값을 보낼 경우. - 어떤 파라미터에서 타입 오류가
	 * 발생했는지(e.getName())를 포함한 메시지를 반환해 클라이언트가 쉽게 원인 파악 가능.
	 */
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	protected ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e,
			HttpServletRequest request) {

		log.warn("[TypeMismatch] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(),
				e.getName() + " 값의 타입이 올바르지 않습니다.", request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 JSON 파싱 실패
	 * 
	 * 설명 (한국어) - 클라이언트가 전송한 요청 바디가 JSON 형식이 아니거나, DTO로 매핑할 수 없는 구조일 때 발생. - 예: 잘못된
	 * JSON 구문, 예상과 다른 필드 타입, 필드 누락 등으로 Jackson이 파싱 실패 시 던지는 예외. - 응답은 일반 사용자용
	 * 메시지("요청 본문을 읽을 수 없습니다.")로 단순화해 노출(내부 스택 추적은 로그에만 남김).
	 *
	 * 보안 팁 - 파싱 실패의 세부 원인(예: 어떤 필드에서 에러가 났는지)은 로그로 남기고, 외부에는 노출하지 않음.
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException e,
			HttpServletRequest request) {

		log.warn("[HttpMessageNotReadable] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), "요청 본문을 읽을 수 없습니다.",
				request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	/**
	 * 🔍 404 Not Found (Spring Boot 3.x)
	 * 
	 * 설명 (한국어) - 요청한 리소스가 존재하지 않을 때 서비스/컨트롤러 레이어에서 던지는 커스텀 404 예외를 처리. - Spring
	 * MVC의 기본 404 처리를 대체하거나, 도메인 차원에서 '리소스 없음'을 명확히 표현하고 싶을 때 사용. - 예:
	 * service.findById(id)에서 Optional.empty()인 경우 throw new
	 * NoResourceFoundException(...)
	 *
	 * 설계 팁 - 컨트롤러/서비스에서 일관되게 이 예외를 던지면 클라이언트는 항상 표준화된 404 응답을 받을 수 있음.
	 */
	@ExceptionHandler(NoResourceFoundException.class)
	protected ResponseEntity<ErrorResponse> handleNoResourceFound(NoResourceFoundException e,
			HttpServletRequest request) {

		log.warn("[NoResourceFound] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.ENTITY_NOT_FOUND.getCode(), "요청한 리소스를 찾을 수 없습니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	/**
	 * 🔍 접근 거부 예외 처리 (Access Denied)
	 *
	 * 설명 (한국어) - Spring Security에서 인증(로그인)은 되어 있으나 해당 리소스/행위를 수행할 권한이 없을 때 발생하는 예외를
	 * 처리한다. - 예: 사용자는 로그인은 했지만 ROLE_ADMIN 권한이 필요한 API를 호출한 경우 AccessDeniedException
	 * 발생. - 응답으로는 민감한 내부 정보를 노출하지 않고 '권한 없음'을 명확히 알리기 위해 403 상태와 일반화된 메시지를 반환.
	 *
	 * 운영 팁 - 세부 권한 정보(요청자가 어떤 권한을 요구했는지 등)는 로그에 남기되, 클라이언트에는 노출하지 말 것. - 필요 시 응답에
	 * 권한 정보나 재인증(flow)을 안내하는 링크/코드를 추가할 수 있음(보안 정책에 따라 결정).
	 */
	@ExceptionHandler(AccessDeniedException.class)
	protected ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {

		log.warn("[AccessDenied] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.FORBIDDEN.getCode(), "접근 권한이 없습니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	}

	/**
	 * 🔍 지원하지 않는 미디어 타입 (Unsupported Content-Type)
	 *
	 * 설명 (한국어) - 클라이언트가 서버에서 기대하지 않는 Content-Type 헤더로 요청했을 때 발생. 예: API가
	 * application/json을 기대하는데 client가 text/plain 또는 application/xml로 전송한 경우. -
	 * Spring이 HttpMessageConverter로 변환할 수 없을 때 HttpMediaTypeNotSupportedException이
	 * 던져짐. - 응답은 415 Unsupported Media Type으로 반환하고, 허용되는 타입 목록을 추가로 안내할 수도 있음.
	 *
	 * 개선 아이디어 - e.getSupportedMediaTypes()를 이용해 허용되는 타입을 응답 헤더(Allow/Accept)나 body에
	 * 포함시키면 클라이언트 디버깅에 도움됨.
	 */
	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	protected ResponseEntity<ErrorResponse> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException e,
			HttpServletRequest request) {

		log.warn("[MediaTypeNotSupported] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), "지원하지 않는 Content-Type입니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
	}

	/**
	 * 🔍 파일 업로드 크기 초과 예외 처리 (Max Upload Size Exceeded)
	 *
	 * 설명 (한국어) - Spring Multipart 업로드 처리 중 업로드 파일의 크기가 서버에 설정된 최대 허용 크기를 초과하면 발생.
	 * 예: application.properties/yml 에 spring.servlet.multipart.max-file-size=5MB
	 * 등으로 제한한 경우. - 이 예외는 클라이언트에게 파일 크기 제한 초과를 명확히 알려주기 위해 413 Payload Too Large로
	 * 응답.
	 *
	 * 운영 팁 - 프론트엔드에서 업로드 전 파일 크기 검증을 수행해 불필요한 네트워크 사용을 줄일 것. - 서버 설정:
	 * spring.servlet.multipart.max-file-size,
	 * spring.servlet.multipart.max-request-size 등을 적절히 설정. - 큰 파일 처리 필요 시 스트리밍 업로드,
	 * 외부 스토리지(예: S3)로의 직접 업로드 방안 고려.
	 */
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	protected ResponseEntity<ErrorResponse> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e,
			HttpServletRequest request) {

		log.warn("[MaxUploadSizeExceeded] {}", e.getMessage());

		ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE.getCode(), "파일 크기가 제한을 초과했습니다.",
				request.getRequestURI());

		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
	}

}
