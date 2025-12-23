package com.carpick.global.response;

import java.time.LocalDateTime;

import com.carpick.global.enums.ErrorCode;

public record ErrorResponse(
        String code,
        String message,
        String path,
        LocalDateTime timestamp
) {
    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return new ErrorResponse(
                errorCode.getCode(),
                errorCode.getMessage(),
                path,
                LocalDateTime.now()
        );
    }
}