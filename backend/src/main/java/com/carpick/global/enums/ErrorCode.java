package com.carpick.global.enums;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// ======================
    // Common
    // ======================
    INVALID_INPUT_VALUE(
        HttpStatus.BAD_REQUEST,
        "C001",
        "요청 값이 올바르지 않습니다"
    ),
    INTERNAL_SERVER_ERROR(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "C002",
        "서버 내부 오류가 발생했습니다"
    ),
    METHOD_NOT_ALLOWED(
        HttpStatus.METHOD_NOT_ALLOWED,
        "C003",
        "허용되지 않은 HTTP 메서드입니다"
    ),

    // ======================
    // Business
    // ======================
    ENTITY_NOT_FOUND(
        HttpStatus.NOT_FOUND,
        "B001",
        "대상을 찾을 수 없습니다"
    ),
    DUPLICATE_RESOURCE(
        HttpStatus.CONFLICT,
        "B002",
        "이미 존재하는 리소스입니다"
    ),

    // ======================
    // Auth
    // ======================
    UNAUTHORIZED(
        HttpStatus.UNAUTHORIZED,
        "A001",
        "인증이 필요합니다"
    ),
    FORBIDDEN(
        HttpStatus.FORBIDDEN,
        "A002",
        "접근 권한이 없습니다"
    ),

    // ======================
    // Web (Page)
    // ======================
    NOT_FOUND(
        HttpStatus.NOT_FOUND,
        "W404",
        "요청하신 페이지를 찾을 수 없습니다"
    ),
    ACCESS_DENIED(
        HttpStatus.FORBIDDEN,
        "W403",
        "접근 권한이 없습니다"
    ),

    // ======================
    // Database
    // ======================
    DATABASE_ERROR(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "DB001",
        "데이터베이스 오류가 발생했습니다"
    ),
    MYBATIS_MAPPING_ERROR(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "DB002",
        "MyBatis 매핑 중 오류가 발생했습니다"
    );

	private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    /** 웹 에러용 */
    public String message() {
        return message;
    }

    /** API 에러용 */
    public String code() {
        return code;
    }

    /** 호환성을 위한 메서드들 */
    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}

