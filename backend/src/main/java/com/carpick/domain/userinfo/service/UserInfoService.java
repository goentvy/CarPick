package com.carpick.domain.userinfo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.userinfo.dto.UserInfoResponse;
import com.carpick.domain.userinfo.dto.UserInfoUpdateRequest;
import com.carpick.domain.userinfo.entity.UserInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final com.carpick.domain.userinfo.mapper.UserInfoMapper userInfoMapper;
    private final PasswordEncoder passwordEncoder;

    public UserInfoResponse getUserInfo(Long userId) {

        UserInfo user = userInfoMapper.findById(userId);

        if (user == null) {
            throw new IllegalStateException("회원 정보가 존재하지 않습니다.");
        }

        return new UserInfoResponse(
                user.getEmail(),
                user.getName(),
                user.getPhone(),
                user.getBirth(),
                user.getGender(),
                user.isMarketingAgree(),

                // ✅ 핵심 수정 포인트
                user.getRole(),

                user.getProvider()
        );
    }

    @Transactional
    public void updateUserInfo(Long userId, UserInfoUpdateRequest request) {

        String encodedPassword = null;
        if (request.password() != null && !request.password().isEmpty()) {
            encodedPassword = passwordEncoder.encode(request.password());
        }

        int updated = userInfoMapper.updateUserInfo(
                userId,
                request.name(),
                request.phone(),
                request.birth(),
                encodedPassword,
                request.marketingAgree()
        );

        if (updated == 0) {
            throw new IllegalStateException("회원 정보 수정 실패");
        }
    }

    @Transactional
    public void withdraw(Long userId) {

        UserInfo user = userInfoMapper.findById(userId);

        if (user == null) {
            throw new IllegalArgumentException("사용자 없음");
        }

        if ("LOCAL".equalsIgnoreCase(user.getProvider())) {

            int deleted = userInfoMapper.deleteUser(userId);
            if (deleted == 0) {
                throw new IllegalStateException("로컬 회원 탈퇴 실패");
            }

        } else {

            int updated = userInfoMapper.softDeleteUser(userId);
            if (updated == 0) {
                throw new IllegalStateException("소셜 회원 탈퇴 실패");
            }
        }
    }
}
