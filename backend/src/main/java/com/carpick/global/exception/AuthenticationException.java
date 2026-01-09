package com.carpick.global.exception;

import com.carpick.global.exception.enums.ErrorCode;

/**
 * 🔐 AuthenticationException (인증 실패 예외)
 * - 로그인 실패, 인증 토큰 오류 등 인증 관련 예외
 * - 사용자 인증이 필요한 상황에서 발생
 * - 401 Unauthorized 상태로 응답
 */
public class AuthenticationException extends RuntimeException {

    private final ErrorCode errorCode;

    //기존 생성자 유지
    public AuthenticationException(ErrorCode errorCode) {
        super(errorCode.getLogMessage()); // 로그 메시지 전달
        this.errorCode = errorCode;
    }

    // 기존 생성자 유지
    public AuthenticationException(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getLogMessage(), cause); // 원인까지 전달
        this.errorCode = errorCode;
    }

    // 추가해야 할 생성자 (사용자 메시지용)
    public AuthenticationException(ErrorCode errorCode, String message) {
        super(message); // 프론트로 내려갈 메시지
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
