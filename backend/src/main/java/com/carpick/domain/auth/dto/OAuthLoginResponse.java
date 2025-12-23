package com.carpick.domain.auth.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class OAuthLoginResponse {
    private boolean success;
    private String token;
    private String name;  // 👈 프론트에서 표시할 이름
    private String email;
}
