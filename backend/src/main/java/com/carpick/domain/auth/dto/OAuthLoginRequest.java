package com.carpick.domain.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

// 프론트에서 보내는 인가 정보
@Getter
@NoArgsConstructor
public class OAuthLoginRequest {


    private String code;
    private String state; // 네이버 보안용

}
