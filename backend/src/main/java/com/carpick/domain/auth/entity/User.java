package com.carpick.domain.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long userId;
    private String email;
    private String passwordHash;

    private String provider;
    private String providerId;

    private String name;
    private String phone;
    private Date birth;

    private Gender gender;
    private Integer marketingAgree;
    private String membershipGrade;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    private Role role;   // ✅ 권한 Enum
}
