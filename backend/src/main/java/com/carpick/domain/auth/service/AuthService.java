package com.carpick.domain.auth.service;

import java.util.Optional;

import com.carpick.domain.auth.entity.Gender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.auth.dto.login.LoginRequest;
import com.carpick.domain.auth.dto.login.LoginResponse;
import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.dto.signup.SignupResponse;
import com.carpick.domain.auth.entity.Role;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.security.jwt.JwtProvider;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {
        log.info("login attempt email={}", request.getEmail());

        User user = Optional.ofNullable(userMapper.findByEmail(request.getEmail()))
                .orElseThrow(() -> new AuthenticationException(
                        ErrorCode.UNAUTHORIZED,
                        "아이디 혹은 비밀번호가 틀렸습니다."
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException(
                    ErrorCode.UNAUTHORIZED,
                    "아이디 혹은 비밀번호가 틀렸습니다."
            );
        }

        String role = Optional.ofNullable(user.getRole())
                .orElse(Role.USER)
                .name();

        String accessToken = jwtProvider.generateToken(user.getUserId(), role);

        return new LoginResponse(
                true,
                "로그인 성공",
                accessToken,
                user.getName(),
                user.getEmail(),
                user.getMembershipGrade(),
                user.getRole()
        );
    }

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        // 1. 이메일 중복 체크
        if (userMapper.existsByEmail(request.getEmail()) > 0) {
            throw new IllegalStateException("이미 존재하는 이메일입니다.");
        }

        // 2. 가입 유형 파악 (provider가 null이거나 "LOCAL"이면 일반 가입)
        boolean isSocial = request.getProvider() != null
                && !request.getProvider().equalsIgnoreCase("local");

        User user = new User();

        // 필수 필드 set
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setBirth(request.getBirth());

        // =====================
// 성별 변환 (프론트에서 "M" / "F" enum 그대로 받음)
// =====================

        try {
            user.setGender(Gender.valueOf(request.getGenderStr()));
        } catch (Exception e) {
            throw new IllegalArgumentException("성별 값이 올바르지 않습니다.");
        }

        // 마케팅 동의 기본 비동의 (법적으로 안전)
        user.setMarketingAgree(
                request.getMarketingAgree() != null ? request.getMarketingAgree() : 0
        );

        // 기본값들
        user.setMembershipGrade("BASIC");
        user.setRole(Role.USER);

        String accessToken = null;

        if (!isSocial) {
            // 일반 가입
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                throw new IllegalArgumentException("일반 회원가입 시 비밀번호는 필수입니다.");
            }

            String encodedPassword = passwordEncoder.encode(request.getPassword());
            user.setPassword(encodedPassword);
            user.setProvider("LOCAL");
            user.setProviderId(null);  // 일반 가입은 providerId 없음

            userMapper.insertLocalUser(user);
        } else {
            // 소셜 가입
            if (request.getProviderId() == null || request.getProviderId().isEmpty()) {
                throw new IllegalArgumentException("소셜 회원가입 시 providerId는 필수입니다.");
            }

            user.setPassword(null);  // 소셜은 비밀번호 없음
            user.setProvider(request.getProvider().toUpperCase());  // "KAKAO", "NAVER" 등 대문자 정규화
            user.setProviderId(request.getProviderId());

            userMapper.insertSocialUser(user);
        }

        // insert 후 userId 자동 바인딩 확인 (안전장치)
        if (user.getUserId() == null) {
            throw new RuntimeException("회원가입 실패: 사용자 ID가 생성되지 않았습니다.");
        }

        // 가입 후 즉시 토큰 발급 (자동 로그인)
        accessToken = jwtProvider.generateToken(user.getUserId(), user.getRole().name());

        return new SignupResponse(true, "회원가입 성공", accessToken, user.getEmail());
    }

    @Transactional(readOnly = true)
    public boolean checkEmailDuplicate(String email) {
        return userMapper.existsByEmail(email) > 0;
    }
}