package com.carpick.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class AuthExceptionHandler {
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthException(AuthenticationException e) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)   // ✅ 401
                .body(Map.of(
                        "success", false,
                        "message", e.getMessage()
                ));
    }
}
