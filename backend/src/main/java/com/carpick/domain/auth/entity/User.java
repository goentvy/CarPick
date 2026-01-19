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

    // 로그인 식별
    private String email;        // nullable
    private String password;

    private String provider;     // LOCAL / NAVER / KAKAO
    private String providerId;   // 소셜 고유 ID (필수)

    // 개인정보
    private String name;
    private String phone;
    private LocalDate birth;     // DATE
    private String gender;       // "M" / "F"

    // 정책
    private Integer marketingAgree;
    private String membershipGrade;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    private Role role;

    private String accessToken;
}
