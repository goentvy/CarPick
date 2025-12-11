package com.carpick.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class User {
    private Long id;
    private String email;
    private String passwordHash;

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
}
