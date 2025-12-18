package com.carpick.admin.useradmin.entity;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserAdmin {

    private Long userId;
    private String email;
    private String name;
    private String phone;
    private LocalDateTime createdAt;
}
