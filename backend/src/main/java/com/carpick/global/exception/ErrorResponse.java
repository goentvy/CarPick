package com.carpick.global.exception;

import java.time.LocalDateTime;

public record ErrorResponse(String code, String message, String path, LocalDateTime timestamp) {

	public static ErrorResponse of(String code, String message, String path) {
		return new ErrorResponse(code, message, path, LocalDateTime.now());
	}
}
