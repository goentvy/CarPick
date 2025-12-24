package com.carpick.global.validation;

import java.util.List;

import org.springframework.validation.BindingResult;

import com.carpick.global.response.FieldErrorDetail;

public class ValidationErrorExtractor {

    public static List<FieldErrorDetail> extract(BindingResult bindingResult) {
        return bindingResult.getFieldErrors().stream()
                .map(FieldErrorDetail::of)
                .toList();
    }
}

