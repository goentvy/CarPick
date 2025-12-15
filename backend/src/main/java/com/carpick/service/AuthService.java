package com.carpick.service;

import com.carpick.auth.exception.AuthenticationException;
import com.carpick.auth.jwt.JwtProvider;
import com.carpick.dto.LoginRequest;
import com.carpick.dto.LoginResponse;
import com.carpick.dto.SignupRequest;
import com.carpick.dto.SignupResponse;
import com.carpick.mapper.UserMapper;
import com.carpick.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new AuthenticationException(
                    "아이디 또는 비밀번호가 올바르지 않습니다."
            );
        }

        String accessToken = jwtProvider.generateToken(
                user.getUser_id(),
                user.getRole().name()
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
