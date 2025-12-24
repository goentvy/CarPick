package com.carpick.global.exception.response;

import java.time.LocalDateTime;
import java.util.List;

import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.exception.enums.MessageType;
import com.carpick.global.util.ProfileResolver;

import jakarta.servlet.http.HttpServletRequest;

public record ValidationErrorResponse(
        String code,
        String message,
        List<FieldErrorDetail> errors,
        String path,
        LocalDateTime timestamp
) {

    public static ValidationErrorResponse of(
            ErrorCode errorCode,
            List<FieldErrorDetail> errors,
            HttpServletRequest request,
            ProfileResolver profileResolver
    ) {
        return new ValidationErrorResponse(
                errorCode.getCode(),
                errorCode.resolveMessage(MessageType.CLIENT, profileResolver),
                errors,
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }
}




