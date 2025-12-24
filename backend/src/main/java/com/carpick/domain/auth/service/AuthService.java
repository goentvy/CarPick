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
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.security.jwt.JwtProvider;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    //토큰 객체, 비밀번호 해쉬 변환 객체 , 유저매퍼(db핸들링) 주입
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {
        //일반 로그인 메서드
        User user = userMapper.findByEmail(request.getEmail());


        //로그인 검증용 메서드 (비밀번호 평문 그대로 비교하지 않음.)
        if (user == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash()
                )
        ) {
            // ✅ 예외 기반 처리
            throw new AuthenticationException(ErrorCode.UNAUTHORIZED);

        }

        String role = Optional.ofNullable(user.getRole())
                .orElse(Role.USER)
                .name();

        //토큰을 발급받음. 차후 개인정보수정 탈퇴할때 쓰임
        String accessToken = jwtProvider.generateToken(
                user.getUserId(),
                role
        );


        //포스트맨에서 로그인 성공후에 나오는 메시지
        return new LoginResponse(
                true,
                "로그인 성공",
                accessToken,
                user.getName(),
                user.getEmail(),
                user.getMembershipGrade()
        );


    }


    @Transactional
    public SignupResponse signup(SignupRequest request) {
        // 1. 이메일 중복 체크
        if (userMapper.existsByEmail(request.getEmail()) > 0) {
            throw new IllegalStateException("이미 존재하는 이메일입니다.");
        }

        // 2. 가입 유형 파악 (provider가 있으면 소셜, 없으면 로컬)
        boolean isSocial = request.getProvider() != null && !request.getProvider().equalsIgnoreCase("local");

        if (!isSocial) {
            // [일반 가입 로직]
            // 현재 request.passwordHash에는 사용자가 입력한 '1234' 같은 평문이 들어있음
            String rawPassword = request.getPasswordHash();

            if (rawPassword == null || rawPassword.isEmpty()) {
                throw new IllegalArgumentException("일반 회원가입 시 비밀번호는 필수입니다.");
            }

            // 평문을 암호화해서 다시 그 자리에(passwordHash) 덮어씌움
            String encodedPassword = passwordEncoder.encode(rawPassword);
            request.setPasswordHash(encodedPassword);

            // DB 저장 (일반 가입 전용 매퍼 호출)
            userMapper.insertLocalUser(request);
        } else {
            // [소셜 가입 로직]
            // 소셜은 비밀번호가 없으므로 암호화 없이 바로 저장

        }

        return new SignupResponse(true, "회원가입 성공", null, request.getEmail());
    }


}
