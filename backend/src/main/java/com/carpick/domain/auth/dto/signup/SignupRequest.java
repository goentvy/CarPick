package com.carpick.domain.auth.dto.signup;

import java.time.LocalDate;

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

    // =====================
    // 로그인 식별
    // =====================

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "이메일 형식이 올바르지 않습니다")
    private String email;

    // 일반 가입 시 필수 (소셜 로그인 시 null 허용 → 서비스 레이어에서 조건 검증)
    private String password;

    // LOCAL / KAKAO / NAVER
    @NotBlank(message = "가입 경로는 필수입니다")
    private String provider;

    // 소셜 로그인 시만 사용
    private String providerId;

    // =====================
    // 개인정보
    // =====================

    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 30, message = "이름은 30자 이내여야 합니다")
    private String name;

    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Pattern(
            regexp = "^01[016789]\\d{7,8}$",
            message = "휴대폰 번호는 숫자만 입력해주세요 (예: 01012341234)"
    )
    private String phone;

    /**
     * 생년월일 (DATE 전용)
     * 예: 2000-01-14
     */
    @NotNull(message = "생년월일은 필수입니다")
    @Past(message = "생년월일은 과거 날짜여야 합니다")
    private LocalDate birth;

    /**
     * 성별 문자열로 수신 (enum 파싱은 Service에서 처리)
     * 허용값: M / F
     */
    @NotBlank(message = "성별은 필수입니다")
    private String genderStr;

    // =====================
    // 정책
    // =====================

    /**
     * 마케팅 수신 동의 여부
     * 1 = 동의 / 0 = 비동의 (기본값 0)
     * ❗ 법적으로 비동의해도 가입 가능
     */
    private Integer marketingAgree = 0;
}
