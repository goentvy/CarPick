package com.carpick.global.response;

import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        String path,
        LocalDateTime timestamp
) {
    public static ErrorResponse of(String message, String path) {
        return new ErrorResponse(message, path, LocalDateTime.now());
    }
}

