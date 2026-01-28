package com.carpick.domain.auth.dto.login;

import com.carpick.domain.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    // ============================
    // ✅ 로그인 결과
    // ============================
    private boolean success;
    private String message;

    // ============================
    // ✅ 사용자 식별 (JWT 생성에 필요)
    // ============================
    private Long userId;

    // ============================
    // ✅ 사용자 정보
    // ============================
    private String name;
    private String email;
    private String membershipGrade;
    private Role role;
}
