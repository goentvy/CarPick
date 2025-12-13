package com.carpick.service;

import com.carpick.dto.LoginRequest;
import com.carpick.dto.LoginResponse;
import com.carpick.dto.SignupRequest;
import com.carpick.dto.SignupResponse;
import com.carpick.mapper.UserMapper;
import com.carpick.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;

    public LoginResponse login(LoginRequest request) {

        User user = userMapper.findByEmail(request.getEmail());

        if (user == null) {
            return new LoginResponse(false, "존재하지 않는 이메일입니다.",
                    null, null, null, null);
        }

        if (!request.getPassword().equals(user.getPassword_hash())) {
            return new LoginResponse(false, "비밀번호가 일치하지 않습니다.",
                    null, null, null, null);
        }

        String fakeToken = "TOKEN_" + user.getId();

        return new LoginResponse(
                true,
                "로그인 성공",
                fakeToken,
                user.getName(),
                user.getEmail(),
                user.getMembershipGrade()
        );
    }

    @Transactional
    public SignupResponse signup(SignupRequest request) {

        if (userMapper.existsByEmail(request.getEmail()) > 0) {
            return new SignupResponse(
                    false,
                    "이미 존재하는 이메일입니다.",
                    null,
                    null
            );
        }

        userMapper.insertUser(request);

        return new SignupResponse(
                true,
                "회원가입 성공",
                null,
                request.getEmail()
        );
    }

    public User getLatestSignupUser() {
        return userMapper.findLatestUser();
    }
}
