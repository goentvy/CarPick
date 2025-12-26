package com.carpick.global.exception.enums;

import org.springframework.http.HttpStatus;

import com.carpick.global.util.ProfileResolver;

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
        "요청 값이 올바르지 않습니다",
        "Invalid input value"
    ),
    INTERNAL_SERVER_ERROR(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "C002",
        "서버 내부 오류가 발생했습니다",
        "Internal server error"
    ),
    METHOD_NOT_ALLOWED(
        HttpStatus.METHOD_NOT_ALLOWED,
        "C003",
        "허용되지 않은 HTTP 메서드입니다",
        "Method not allowed"
    ),
    UNSUPPORTED_MEDIA_TYPE(
    	    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    	    "C004",
    	    "지원하지 않는 요청 형식입니다",
    	    "Unsupported media type"
    ),


    // ======================
    // Business
    // ======================
    ENTITY_NOT_FOUND(
        HttpStatus.NOT_FOUND,
        "B001",
        "대상을 찾을 수 없습니다",
        "Entity not found"
    ),
    DUPLICATE_RESOURCE(
        HttpStatus.CONFLICT,
        "B002",
        "이미 존재하는 리소스입니다",
        "Duplicate resource"
    ),
    BUSINESS_RULE_VIOLATION(
        HttpStatus.BAD_REQUEST,
        "B003",
        "요청을 처리할 수 없습니다",
        "Business rule violation"
    ),
    INVALID_STATE_TRANSITION(
        HttpStatus.CONFLICT,
        "B004",
        "현재 상태에서는 처리할 수 없습니다",
        "Invalid state transition"
    ),
    RESOURCE_LOCKED(
        HttpStatus.CONFLICT,
        "B005",
        "처리 중인 리소스입니다",
        "Resource is locked"
    ),

    // ======================
    // Auth (Security / JWT)
    // ======================
    AUTH_TOKEN_MISSING(
        HttpStatus.UNAUTHORIZED,
        "A000",
        "인증이 필요합니다",
        "Authorization header is missing"
    ),
    AUTH_TOKEN_EXPIRED(
        HttpStatus.UNAUTHORIZED,
        "A001",
        "인증이 만료되었습니다",
        "JWT token expired"
    ),
    AUTH_TOKEN_INVALID(
        HttpStatus.UNAUTHORIZED,
        "A002",
        "인증에 실패했습니다",
        "JWT token is invalid"
    ),
    FORBIDDEN(
        HttpStatus.FORBIDDEN,
        "A003",
        "접근 권한이 없습니다",
        "Access is denied"
    ),
    AUTH_TOKEN_REVOKED(
        HttpStatus.UNAUTHORIZED,
        "A004",
        "인증이 만료되었습니다",
        "JWT token revoked"
    ),
    AUTH_TOKEN_BLACKLISTED(
        HttpStatus.UNAUTHORIZED,
        "A005",
        "인증이 만료되었습니다",
        "JWT token is blacklisted"
    ),
    OAUTH_PROVIDER_ERROR(
        HttpStatus.BAD_GATEWAY,
        "A006",
        "외부 인증 서비스 오류가 발생했습니다",
        "OAuth provider error"
    ),
    AUTH_USER_NOT_FOUND(
    	    HttpStatus.UNAUTHORIZED,
    	    "A007",
    	    "인증에 실패했습니다",
    	    "Authenticated user not found"
    	),
    AUTH_TOKEN_UNSUPPORTED(
    	    HttpStatus.UNAUTHORIZED,
    	    "A008",
    	    "인증에 실패했습니다",
    	    "Unsupported JWT token"
    	),
    AUTH_TOKEN_MALFORMED(
    	    HttpStatus.UNAUTHORIZED,
    	    "A009",
    	    "인증에 실패했습니다",
    	    "Malformed JWT token"
    	),
    AUTH_CREDENTIALS_EXPIRED(
    	    HttpStatus.UNAUTHORIZED,
    	    "A010",
    	    "인증이 만료되었습니다",
    	    "User credentials expired"
    	),
    AUTH_TOKEN_SIGNATURE_INVALID(
    	    HttpStatus.UNAUTHORIZED,
    	    "A011",
    	    "인증에 실패했습니다",
    	    "Invalid JWT token signature"
    	),
    OAUTH_INVALID_CODE(
            HttpStatus.BAD_REQUEST,
            "A012",
            "잘못된 인증 코드입니다",
            "Invalid authorization code"
    ),
    OAUTH_TOKEN_EXCHANGE_FAILED(
            HttpStatus.BAD_GATEWAY,
            "A013",
            "토큰 발급에 실패했습니다",
            "OAuth token exchange failed"
    ),

    // ======================
    // Web (Page)
    // ======================
    UNAUTHORIZED(
    	    HttpStatus.UNAUTHORIZED,
    	    "AUTH-001",
    	    "인증이 필요합니다.",
    	    "Unauthorized access"
    	),
    NOT_FOUND(
        HttpStatus.NOT_FOUND,
        "W404",
        "요청하신 페이지를 찾을 수 없습니다",
        "Page not found"
    ),
    ACCESS_DENIED(
        HttpStatus.FORBIDDEN,
        "W403",
        "접근 권한이 없습니다",
        "Web access denied"
    ),

    // ======================
    // Database
    // ======================
    DATABASE_ERROR(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "DB001",
        "데이터베이스 오류가 발생했습니다",
        "Database error"
    ),
    MYBATIS_MAPPING_ERROR(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "DB002",
        "MyBatis 매핑 중 오류가 발생했습니다",
        "MyBatis mapping error"
    ),
    DB_DUPLICATE_KEY(
            HttpStatus.CONFLICT,
            "DB003",
            "중복된 데이터가 존재합니다",
            "Duplicate key violation"
    );


    private final HttpStatus httpStatus;
    private final String code;
    private final String clientMessage;
    private final String logMessage;
    
    public String resolveMessage(
            MessageType type,
            ProfileResolver profileResolver
    ) {
        if (type == MessageType.LOG) {
            return logMessage;
        }

        // CLIENT
        return profileResolver.isProd()
                ? clientMessage
                : logMessage;
    }

    public String resolveLogMessage() {
        return logMessage;
    }
    
}


