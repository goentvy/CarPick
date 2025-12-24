package com.carpick.global.exception;

import com.carpick.global.enums.ErrorCode;

/**
 * 🔐 AuthenticationException (인증 실패 예외)
 * - 로그인 실패, 인증 토큰 오류 등 인증 관련 예외
 * - 사용자 인증이 필요한 상황에서 발생
 * - 401 Unauthorized 상태로 응답
 */
public class AuthenticationException extends RuntimeException {

    private final ErrorCode errorCode;

    public AuthenticationException(ErrorCode errorCode) {
        super();
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}

