package com.carpick.global.exception;

import org.springframework.http.HttpStatus;

import com.carpick.global.exception.enums.ErrorCode;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {

	 private final ErrorCode errorCode;

	    protected BaseException(ErrorCode errorCode) {
	        super(errorCode.name());
	        this.errorCode = errorCode;
	    }

	    public HttpStatus getHttpStatus() {
	        return errorCode.getHttpStatus();
	    }
}
