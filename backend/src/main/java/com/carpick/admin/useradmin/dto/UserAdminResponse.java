package com.carpick.admin.useradmin.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserAdminResponse {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private String membershipGrade;
    private Integer marketingAgree;
    private LocalDateTime createdAt;
}
