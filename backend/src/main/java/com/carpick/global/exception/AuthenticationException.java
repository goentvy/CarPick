package com.carpick.global.exception;

/**
 * 🔐 AuthenticationException (인증 실패 예외)
 * - 로그인 실패, 인증 토큰 오류 등 인증 관련 예외
 * - 사용자 인증이 필요한 상황에서 발생
 * - 401 Unauthorized 상태로 응답
 */
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
}
