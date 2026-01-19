package com.carpick.domain.auth.entity;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Long userId;

    // =====================
    // 로그인 식별
    // =====================

    private String email;        // nullable (소셜 로그인 고려)
    private String password;

    private String provider;     // LOCAL / NAVER / KAKAO
    private String providerId;   // 소셜 고유 ID

    // =====================
    // 개인정보
    // =====================

    private String name;
    private String phone;
    private LocalDate birth;     // DATE

    private Gender gender;       // ✅ enum (TypeHandler 대상)

    // =====================
    // 정책
    // =====================

    private Integer marketingAgree;
    private String membershipGrade;

    // =====================
    // 권한
    // =====================

    private Role role;

    // =====================
    // 토큰
    // =====================

    private String accessToken;

    // =====================
    // Audit
    // =====================

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
