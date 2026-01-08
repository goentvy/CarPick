package com.carpick.global.exception.handler;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import com.carpick.global.exception.BaseException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.enums.MessageType;
import com.carpick.global.exception.response.ErrorResponse;
import com.carpick.global.exception.response.FieldErrorDetail;
import com.carpick.global.exception.response.ValidationErrorResponse;
import com.carpick.global.util.ProfileResolver;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public abstract class AbstractExceptionHandler {

	protected final ProfileResolver profileResolver;
	
    /**
     * 🔹 클라이언트 메시지
     * - ErrorCode 정책에 전적으로 위임
     */
	protected String resolveClientMessage(BaseException e) {
	    return e.getErrorCode().resolveMessage(
	            MessageType.CLIENT,
	            profileResolver
	    );
	}


    /**
     * 🔹 ErrorResponse 생성 (공통)
     */
	protected ErrorResponse buildErrorResponse(
	        BaseException e,
	        HttpServletRequest request
	) {
	    return ErrorResponse.of(
	            e.getErrorCode(),
	            request,
	            profileResolver
	    );
	}

    /**
     * 🔹 ErrorResponse 생성 (ErrorCode 기반)
     */
    protected ErrorResponse buildErrorResponse(
            ErrorCode errorCode,
            HttpServletRequest request
    ) {
        return ErrorResponse.of(
                errorCode,
                request,
                profileResolver
        );
    }

    /**
     * 🔹 ValidationErrorResponse 생성
     */
    protected ValidationErrorResponse buildValidationErrorResponse(
            ErrorCode errorCode,
            BindingResult bindingResult,
            HttpServletRequest request
    ) {
        List<FieldErrorDetail> errors = FieldErrorDetail.from(bindingResult);
        return ValidationErrorResponse.of(
                errorCode,
                errors,
                request,
                profileResolver
        );
    }

    /**
     * 🔹 ResponseEntity 빌더 (ErrorResponse)
     */
    protected ResponseEntity<ErrorResponse> buildResponseEntity(
            ErrorCode errorCode,
            HttpServletRequest request
    ) {
        ErrorResponse response = buildErrorResponse(errorCode, request);
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }

    protected ResponseEntity<ErrorResponse> buildResponseEntity(
            ErrorCode errorCode,
            HttpServletRequest request,
            String message
    ) {
        ErrorResponse response = ErrorResponse.of(
                errorCode,
                message,
                request
        );

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }

    /**
     * 🔹 ResponseEntity 빌더 (ValidationErrorResponse)
     */
    protected ResponseEntity<ValidationErrorResponse> buildValidationResponseEntity(
            ErrorCode errorCode,
            BindingResult bindingResult,
            HttpServletRequest request
    ) {
        ValidationErrorResponse response = buildValidationErrorResponse(
                errorCode,
                bindingResult,
                request
        );
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }

    /**
     * 🔹 예상 가능한 예외 로깅
     * - 항상 LOG 메시지 사용
     */
    protected void logExpectedException(
            BaseException e,
            HttpServletRequest request
    ) {
        log.warn(
                "[ExpectedException] uri={}, code={}, message={}",
                request.getRequestURI(),
                e.getErrorCode().getCode(),
                e.getErrorCode().resolveLogMessage()
        );
    }

    /**
     * 🔹 Spring 예외 로깅 (예상 가능)
     */
    protected void logExpectedSpringException(
            String exceptionType,
            ErrorCode errorCode,
            HttpServletRequest request,
            Object... additionalInfo
    ) {
        if (additionalInfo.length > 0) {
            log.warn(
                    "[ExpectedException][{}] uri={}, code={}, info={}",
                    exceptionType,
                    request.getRequestURI(),
                    errorCode.getCode(),
                    additionalInfo[0]
            );
        } else {
            log.warn(
                    "[ExpectedException][{}] uri={}, code={}",
                    exceptionType,
                    request.getRequestURI(),
                    errorCode.getCode()
            );
        }
    }

    /**
     * 🔹 예상 못한 예외 로깅
     */
    protected void logUnexpectedException(
            Exception e,
            HttpServletRequest request
    ) {
        log.error(
                "[UnexpectedException] uri={}",
                request.getRequestURI(),
                e
        );
    }

    /**
     * 🔹 Spring 예외 로깅 (예상 못한)
     */
    protected void logUnexpectedSpringException(
            String exceptionType,
            Exception e,
            HttpServletRequest request
    ) {
        log.error(
                "[UnexpectedException][{}] uri={}",
                exceptionType,
                request.getRequestURI(),
                e
        );
    }
}

