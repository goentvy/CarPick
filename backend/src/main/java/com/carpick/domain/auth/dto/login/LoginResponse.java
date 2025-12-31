package com.carpick.domain.auth.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;

    private String accessToken;     // JWT 또는 임시 토큰
    private String name;
    private String email;
    private String membershipGrade;

}
