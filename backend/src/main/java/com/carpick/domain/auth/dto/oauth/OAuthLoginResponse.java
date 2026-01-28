package com.carpick.domain.auth.dto.oauth;

import com.carpick.domain.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class OAuthLoginResponse {

    private boolean success;

    // ✅ JWT Access Token (일반 로그인과 동일)
    private String accessToken;

    private String name;
    private String email;
    private String provider;

    // ✅ 권한 포함 (ADMIN / USER)
    private Role role;
}
