package com.carpick.service;


import com.carpick.dto.LoginRequest;
import com.carpick.dto.LoginResponse;
import com.carpick.mapper.UserMapper;
import com.carpick.model.User;
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

        // 비밀번호 비교 (비밀번호 평문 비교: 테스트 단계에서는 OK)
        if (!request.getPassword().equals(user.getPasswordHash())) {
            return new LoginResponse(false, "비밀번호가 일치하지 않습니다.",
                    null, null, null, null);
        }

        // 나중에 JWT로 교체 가능
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
}
