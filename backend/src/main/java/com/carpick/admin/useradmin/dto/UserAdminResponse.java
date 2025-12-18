package com.carpick.admin.useradmin.dto;

import com.carpick.admin.useradmin.entity.UserAdmin;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserAdminResponse {

    private final Long userId;
    private final String email;
    private final String name;
    private final String phone;
    private final LocalDateTime createdAt;

    public UserAdminResponse(UserAdmin user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.createdAt = user.getCreatedAt();
    }
}
