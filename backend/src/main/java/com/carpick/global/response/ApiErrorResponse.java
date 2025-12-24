package com.carpick.global.response;

import java.time.LocalDateTime;

import com.carpick.global.enums.ErrorCode;
import com.carpick.global.util.ProfileResolver;

import jakarta.servlet.http.HttpServletRequest;

public record ApiErrorResponse(
        String code,
        String message,
        String path,
        LocalDateTime timestamp
) {
    public static ApiErrorResponse of(
            ErrorCode errorCode,
            HttpServletRequest request,
            ProfileResolver profileResolver
    ) {
        return new ApiErrorResponse(
                errorCode.getCode(),
                errorCode.getMessageByProfile(profileResolver),
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }
}


