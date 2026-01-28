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

    private String email;
    private String password;

    private String provider;
    private String providerId;

    // =====================
    // 개인정보
    // =====================

    private String name;
    private String phone;
    private LocalDate birth;

    private Gender gender;

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
    // Audit
    // =====================

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
