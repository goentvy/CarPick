package com.carpick.global.response;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.validation.BindingResult;

import com.carpick.global.enums.ErrorCode;
import com.carpick.global.util.ProfileResolver;
import com.carpick.global.validation.ValidationErrorExtractor;

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
            BindingResult bindingResult,
            HttpServletRequest request,
            ProfileResolver profileResolver
    ) {
        return new ValidationErrorResponse(
                errorCode.getCode(),
                errorCode.getMessageByProfile(profileResolver),
                ValidationErrorExtractor.extract(bindingResult),
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }
}


