package com.carpick.global.exception.response;

import java.time.LocalDateTime;

import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.enums.MessageType;
import com.carpick.global.util.ProfileResolver;

import jakarta.servlet.http.HttpServletRequest;

public record ErrorResponse(
        String code,
        String message,
        String path,
        LocalDateTime timestamp
) {
    public static ErrorResponse of(
            ErrorCode errorCode,
            HttpServletRequest request,
            ProfileResolver profileResolver
    ) {
        return new ErrorResponse(
                errorCode.getCode(),
                errorCode.resolveMessage(MessageType.CLIENT, profileResolver),
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }
}
