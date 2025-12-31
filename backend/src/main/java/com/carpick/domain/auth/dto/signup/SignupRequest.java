package com.carpick.domain.auth.dto.signup;


import java.util.Date;

import com.carpick.domain.auth.entity.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SignupRequest {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "이메일 형식이 올바르지 않습니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "비밀번호는 영문과 숫자를 포함해야 합니다"
    )

    private String password;

    @NotBlank(message = "provider는 필수입니다")
    private String provider;

    @NotBlank(message = "providerId는 필수입니다")
    private String providerId;

    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 30, message = "이름은 30자 이내여야 합니다")
    private String name;

    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Pattern(
            regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$",
            message = "휴대폰 번호 형식이 올바르지 않습니다"
    )
    private String phone;

    @NotNull(message = "생년월일은 필수입니다")
    @Past(message = "생년월일은 과거 날짜여야 합니다")
    private Date birth;

    @NotNull(message = "성별은 필수입니다")
    private Gender gender;

    private boolean marketingAgree;

    private String accessToken;


}




