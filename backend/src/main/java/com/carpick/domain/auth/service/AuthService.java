package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.login.LoginRequest;
import com.carpick.domain.auth.dto.login.LoginResponse;
import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.dto.signup.SignupResponse;
import com.carpick.domain.auth.entity.Gender;
import com.carpick.domain.auth.entity.Role;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /* =====================================================
       ✅ 로그인 — 인증만 담당 (JWT는 Controller 책임)
       ===================================================== */

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        log.debug("[AUTH-LOGIN] attempt email={}", request.getEmail());

        User user = userMapper.findByEmail(request.getEmail());

        if (user == null) {
            throw new AuthenticationException(
                    ErrorCode.UNAUTHORIZED,
                    "아이디 혹은 비밀번호가 틀렸습니다."
            );
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException(
                    ErrorCode.UNAUTHORIZED,
                    "아이디 혹은 비밀번호가 틀렸습니다."
            );
        }

        // ============================
        // PK 방어
        // ============================
        if (user.getUserId() == null) {
            log.error("[AUTH-LOGIN] userId null email={}", user.getEmail());
            throw new IllegalStateException("로그인 실패: 사용자 PK 매핑 오류");
        }

        Role role = user.getRole() != null ? user.getRole() : Role.USER;

        log.info("[AUTH-LOGIN] success userId={} role={}", user.getUserId(), role);

        return new LoginResponse(
                true,
                "로그인 성공",
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getMembershipGrade(),
                role
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse loginById(Long userId) {

        User user = Optional.ofNullable(
                userMapper.findById(userId)
        ).orElseThrow(() -> new AuthenticationException(
                ErrorCode.UNAUTHORIZED,
                "사용자를 찾을 수 없습니다."
        ));

        Role role = user.getRole() != null ? user.getRole() : Role.USER;

        return new LoginResponse(
                true,
                "인증 유지",
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getMembershipGrade(),
                role
        );
    }


    /* =====================================================
       ✅ 회원가입
       ===================================================== */

    @Transactional
    public SignupResponse signup(SignupRequest request) {

        if (userMapper.existsByEmail(request.getEmail()) > 0) {
            throw new IllegalStateException("이미 존재하는 이메일입니다.");
        }

        boolean isSocial = request.getProvider() != null
                && !request.getProvider().equalsIgnoreCase("local");

        User user = new User();

        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setBirth(request.getBirth());

        try {
            user.setGender(Gender.valueOf(request.getGenderStr()));
        } catch (Exception e) {
            throw new IllegalArgumentException("성별 값이 올바르지 않습니다.");
        }

        user.setMarketingAgree(
                request.getMarketingAgree() != null ? request.getMarketingAgree() : 0
        );
        user.setMembershipGrade("BASIC");
        user.setRole(Role.USER);

        if (!isSocial) {

            if (request.getPassword() == null || request.getPassword().isBlank()) {
                throw new IllegalArgumentException("일반 회원가입 시 비밀번호는 필수입니다.");
            }

            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setProvider("LOCAL");
            user.setProviderId(null);

            userMapper.insertLocalUser(user);

        } else {

            if (request.getProviderId() == null || request.getProviderId().isBlank()) {
                throw new IllegalArgumentException("소셜 회원가입 시 providerId는 필수입니다.");
            }

            user.setPassword(null);
            user.setProvider(request.getProvider().toUpperCase());
            user.setProviderId(request.getProviderId());

            userMapper.insertSocialUser(user);
        }

        if (user.getUserId() == null) {
            log.error("[AUTH-SIGNUP] PK not generated email={}", user.getEmail());
            throw new IllegalStateException("회원가입 실패: 사용자 PK 생성 실패");
        }

        log.info("[AUTH-SIGNUP] success userId={}", user.getUserId());

        return new SignupResponse(
                true,
                "회원가입 성공",
                user.getEmail()
        );
    }

    /* =====================================================
       ✅ 이메일 중복 확인
       ===================================================== */

    @Transactional(readOnly = true)
    public boolean checkEmailDuplicate(String email) {
        return userMapper.existsByEmail(email) > 0;
    }
}
