package com.carpick.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// Common
	INVALID_INPUT_VALUE("C001", "요청 값이 올바르지 않습니다"),
	INTERNAL_SERVER_ERROR("C002", "서버 내부 오류가 발생했습니다"),
	METHOD_NOT_ALLOWED("C003", "허용되지 않은 HTTP 메서드입니다"),

	// Business
	ENTITY_NOT_FOUND("B001", "대상을 찾을 수 없습니다"),
	DUPLICATE_RESOURCE("B002", "이미 존재하는 리소스입니다"),

	// Auth
	UNAUTHORIZED("A001", "인증이 필요합니다"),
	FORBIDDEN("A002", "접근 권한이 없습니다"),

	// Database / MyBatis
	DATABASE_ERROR("DB001", "데이터베이스 오류가 발생했습니다"),
	MYBATIS_MAPPING_ERROR("DB002", "MyBatis 매핑 중 오류가 발생했습니다");

	private final String code;
	private final String message;

}
