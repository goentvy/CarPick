package com.carpick.domain.user.dto;

import java.time.LocalDate;

public record UserInfoResponse(
        String email,
        String name,
        String phone,
        LocalDate birth,
        String gender,
        boolean marketingAgree,
        String membershipGrade
) {}
