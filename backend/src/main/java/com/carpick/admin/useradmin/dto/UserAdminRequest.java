package com.carpick.admin.useradmin.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserAdminRequest {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private LocalDate birth;
    private String gender;          // 'M' or 'F'

    // 🔥 NOT NULL 방지: 폼에서 안 오면 0
    private Integer marketingAgree = 0;

    // 🔥 반드시 입력받게 폼에서 select로 강제
    private String membershipGrade; // 'BASIC' or 'VIP'
}
