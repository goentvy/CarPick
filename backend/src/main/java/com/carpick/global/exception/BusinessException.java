package com.carpick.global.exception;

import com.carpick.global.enums.ErrorCode;

import lombok.Getter;

/**
 * 📼 BusinessException (비즈니스 로직 예외)
 * - 비즈니스 로직 오류 시 명시적으로 발생시키는 예외
 * - ErrorCode를 통해 사용자에게 명확한 오류 메시지 전달
 * - 비즈니스 규칙 위반, 데이터 검증 실패 등에 사용
 */
@Getter
public class BusinessException extends RuntimeException {

	private final ErrorCode errorCode;

	/**
	 * ErrorCode만으로 예외 생성
	 * @param errorCode 에러 코드 (메시지는 ErrorCode의 기본 메시지 사용)
	 */
	public BusinessException(ErrorCode errorCode) {
		super();
		this.errorCode = errorCode;
	}

	/**
	 * ErrorCode와 상세 메시지로 예외 생성
	 * @param errorCode 에러 코드
	 * @param detailMessage 상세 메시지 (ErrorCode 기본 메시지 대신 사용)
	 */
	public BusinessException(ErrorCode errorCode, String detailMessage) {
		super(detailMessage);
		this.errorCode = errorCode;
	}
	
	// 로그 추적용 생성자
	public BusinessException(ErrorCode errorCode, String detailMessage, Throwable cause) {
	    super(detailMessage, cause);
	    this.errorCode = errorCode;
	}

	
}
