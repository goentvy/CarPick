package com.carpick.domain.userinfo.dto;

import java.time.LocalDate;

public record UserInfoUpdateRequest(
        String name,
        String phone,
        LocalDate birth,
        String passwordHash,
        boolean marketingAgree
) {}
