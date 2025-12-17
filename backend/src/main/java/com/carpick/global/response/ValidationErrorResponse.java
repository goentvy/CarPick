package com.carpick.global.response;

import java.time.LocalDateTime;
import java.util.Map;

import com.carpick.global.enums.ErrorCode;

public record ValidationErrorResponse(
	    String code,
	    String message,
	    Map<String, String> errors,
	    String path,
	    LocalDateTime timestamp
	) {
	    public static ValidationErrorResponse of(
	            String code,
	            String message,
	            Map<String, String> errors,
	            String path
	    ) {
	        return new ValidationErrorResponse(
	            code, message, errors, path, LocalDateTime.now()
	        );
	    }
	    
	    public static ValidationErrorResponse of(
	            ErrorCode errorCode,
	            Map<String, String> errors,
	            String path
	    ) {
	        return new ValidationErrorResponse(
	                errorCode.getCode(),
	                errorCode.getMessage(),
	                errors,
	                path,
	                LocalDateTime.now()
	        );
	    }
	}
