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

    // ✅ ⭐ 인증/비즈니스 예외용 (사용자 메시지 직접 전달)
    public static ErrorResponse of(
            ErrorCode errorCode,
            String message,
            HttpServletRequest request
    ) {
        return new ErrorResponse(
                errorCode.getCode(),
                message,
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }
}
