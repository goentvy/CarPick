package com.carpick.domain.userinfo.entity;

import com.carpick.domain.auth.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserInfo {

    private Long userId;

    private String email;
    private String password;

    private String provider;
    private String providerId;

    private String name;
    private String phone;

    private LocalDate birth;
    private String gender;

    private boolean marketingAgree;

    // ⭐ 권한 (JWT + Security에서 사용하는 핵심 필드)
    private Role role;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

}
