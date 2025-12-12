package com.carpick.dto;


import lombok.Data;

import java.util.Date;

@Data
public class SignupRequest {
    private String email;          // 이메일
    private String password;       // 비밀번호 (원문 → 서비스에서 암호화)

    private String name;           // 이름
    private String phone;          // 전화번호
    private Date birth;            // 생년월일

    private String gender;         // M / F
    private boolean marketingAgree; // 마케팅 수신 동의


}
