package com.carpick.admin.useradmin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAdminRequest {

    private Long userId;
    private String email;
    private String name;
    private String phone;
}
