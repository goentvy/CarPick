package com.carpick.domain.auth.dto;


import lombok.Data;

import java.util.Date;

@Data
public class SignupRequest {


    private String email;
    private String password;

    private String provider;     // ✅ 추가
    private String provider_Id;   // ✅ 추가

    private String name;
    private String phone;
    private Date birth;
    private String gender;
    private boolean marketingAgree;
}




