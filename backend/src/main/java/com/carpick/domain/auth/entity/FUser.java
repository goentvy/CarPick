package com.carpick.domain.auth.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FUser {

    private Long userId;
    private String email;
    private String password;   // users.PASSWORD
    private String name;

}
