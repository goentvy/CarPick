package com.carpick.global.validation;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

public final class ValidationErrorExtractor {

    public static Map<String, String> extract(BindingResult result) {
        return result.getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "입력값이 올바르지 않습니다",
                (existing, replacement) -> existing + ", " + replacement
            ));
    }
}
