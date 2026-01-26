package com.carpick.domain.auth.dto.signup;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupResponse {
    private boolean success;
    private String message;
    private String accessToken;  // null 허용되게 String
    private String email;

    // ⭐ 선택: 기존 호환 위해 토큰 없는 생성자 오버로딩 (너 원래 코드 있었으면)
    public SignupResponse(boolean success, String message, String email) {
        this(success, message, null, email);
    }



}
