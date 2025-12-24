package com.carpick.global.exception.response;

import java.util.List;

import org.springframework.validation.BindingResult;
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

    public static List<FieldErrorDetail> from(BindingResult bindingResult) {
        return bindingResult
                .getFieldErrors()
                .stream()
                .map(FieldErrorDetail::of)
                .toList();
    }
}
