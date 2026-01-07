package com.carpick.global.exception;

import com.carpick.global.exception.enums.ErrorCode;

import lombok.Getter;

/**
 * 📼 BusinessException (비즈니스 로직 예외)
 * - 비즈니스 로직 오류 시 명시적으로 발생시키는 예외
 * - ErrorCode를 통해 사용자에게 명확한 오류 메시지 전달
 * - 비즈니스 규칙 위반, 데이터 검증 실패 등에 사용
 */

@Getter
public class BusinessException extends BaseException {

    /**
     * ErrorCode만으로 예외 생성
     * - 메시지는 ErrorCode 정책에 따름
     */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode);
    }

    /**
     * ErrorCode + 사용자 메시지
     * - ErrorCode 기본 정책은 유지
     * - 메시지 오버라이드는 "컨텍스트용" (로그에만 사용 권장)
     */
    public BusinessException(ErrorCode errorCode, String overrideMessage) {
        super(errorCode);
        // 선택: RuntimeException message 오버라이드 용도
        // super(overrideMessage); ❌ (BaseException에서 막아둠)
    }

    /**
     * ErrorCode + 사용자 메시지 + 로그 메시지
     * ❌ 제거 권장
     * → 메시지 정책은 ErrorCode로 통합
     */
}

