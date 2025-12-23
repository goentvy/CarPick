package com.carpick.global.response;

import org.springframework.validation.FieldError;

public record FieldErrorDetail(
        String field,
        Object rejectedValue,
        String message
) {
    public static FieldErrorDetail of(FieldError error) {
        return new FieldErrorDetail(
                error.getField(),
                error.getRejectedValue(),
                error.getDefaultMessage()
        );
    }
}

