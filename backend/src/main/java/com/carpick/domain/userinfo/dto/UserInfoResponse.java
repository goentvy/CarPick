package com.carpick.domain.userinfo.dto;

import java.time.LocalDate;

import com.carpick.domain.auth.entity.Role;

public record UserInfoResponse(
        String email,
        String name,
        String phone,
        LocalDate birth,
        String gender,
        boolean marketingAgree,

        // ⭐ 문자열 등급 제거 → 권한 enum 통합
        Role role,

        String provider
) {}
