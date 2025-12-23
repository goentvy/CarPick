package com.carpick.domain.auth.service;


import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.carpick.domain.auth.dto.LoginRequest;
import com.carpick.domain.auth.dto.LoginResponse;
import com.carpick.domain.auth.dto.SignupRequest;
import com.carpick.domain.auth.dto.SignupResponse;
import com.carpick.domain.auth.entity.Role;
import com.carpick.domain.auth.entity.User;
import com.carpick.domain.auth.mapper.UserMapper;
import com.carpick.global.enums.ErrorCode;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.security.jwt.JwtProvider;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {

        User user = userMapper.findByEmail(request.getEmail());

        if (user == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword_hash()
                )
        ) {
            // ✅ 예외 기반 처리
        	throw new AuthenticationException(ErrorCode.UNAUTHORIZED);

        }

        String role = Optional.ofNullable(user.getRole())
                .orElse(Role.USER)
                .name();


        String accessToken = jwtProvider.generateToken(
                user.getUser_id(),
                role
        );

        return new LoginResponse(
                true,
                "로그인 성공",
                accessToken,
                user.getName(),
                user.getEmail(),
                user.getMembershipGrade()
        );


    }

    // 🔐 무결성 보장 (중요)
    @Transactional
    public SignupResponse signup(SignupRequest request) {

        if (userMapper.existsByEmail(request.getEmail()) > 0) {
            throw new IllegalStateException("이미 존재하는 이메일입니다.");
        }

        request.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userMapper.insertUser(request);

        return new SignupResponse(
                true,
                "회원가입 성공",
                null,
                request.getEmail()
        );
    }


}
