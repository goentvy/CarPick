package com.carpick.domain.userinfo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

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

    private String membershipGrade;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
