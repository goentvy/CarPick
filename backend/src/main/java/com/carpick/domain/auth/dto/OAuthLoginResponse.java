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
    private String name;
    private String email;
    private String provider;
}
