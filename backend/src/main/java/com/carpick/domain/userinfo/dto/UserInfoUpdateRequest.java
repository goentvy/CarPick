package com.carpick.domain.userinfo.dto;

import java.time.LocalDate;

public record UserInfoUpdateRequest(
        String name,
        String phone,
        LocalDate birth,
        // 프론트에서 "password"로 보내는 값을 이 필드에 매핑합니다.
        String password,
        boolean marketingAgree
) {
}
