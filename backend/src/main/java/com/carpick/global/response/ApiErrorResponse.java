package com.carpick.global.response;

import java.time.LocalDateTime;

import com.carpick.global.enums.ErrorCode;

public record ApiErrorResponse(
        String code,
        String message,
        String path,
        LocalDateTime timestamp
) {
    public static ApiErrorResponse of(
            String code,
            String message,
            String path
    ) {
        return new ApiErrorResponse(code, message, path, LocalDateTime.now());
    }
    
    public static ApiErrorResponse of(
            ErrorCode errorCode,
            String path
    ) {
        return new ApiErrorResponse(
                errorCode.getCode(),
                errorCode.getMessage(),
                path,
                LocalDateTime.now()
        );
    }
    
}
