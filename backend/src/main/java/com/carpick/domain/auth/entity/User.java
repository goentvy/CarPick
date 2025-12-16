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
    private Long user_id;
    private String email;
    private String password_hash;

    private String provider;
    private String providerId;

    private String name;
    private String phone;
    private Date birth;

    private String gender;
    private Integer marketingAgree;
    private String membershipGrade;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    private Role role;   // ✅ 권한 Enum
}
