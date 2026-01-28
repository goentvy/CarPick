package com.carpick.domain.auth.entity;

public enum Role {

    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private final String securityRole;

    Role(String securityRole) {
        this.securityRole = securityRole;
    }

    // =====================
    // Spring Security용 권한 문자열
    // =====================
    public String securityRole() {
        return securityRole;
    }

    // =====================
    // JWT / DB 문자열 → enum 변환
    // =====================
    public static Role from(String value) {
        return Role.valueOf(value.toUpperCase());
    }
}
