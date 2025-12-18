package com.carpick.domain.userinfo.service;

import com.carpick.domain.user.dto.UserInfoResponse;
import com.carpick.domain.userinfo.dto.UserInfoUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final com.carpick.domain.userinfo.mapper.UserInfoMapper userInfoMapper;

    public UserInfoResponse getUserInfo(Long userId) {

        com.carpick.domain.userinfo.entity.UserInfo user = userInfoMapper.selectByUserId(userId);

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
                user.getMembershipGrade()
        );
    }

    @Transactional
    public void updateUserInfo(Long userId, UserInfoUpdateRequest request) {

        int updated = userInfoMapper.updateUserInfo(
                userId,
                request.name(),
                request.phone(),
                request.birth(),
                request.marketingAgree()
        );

        if (updated == 0) {
            throw new IllegalStateException("회원 정보 수정 실패");
        }
    }

    @Transactional
    public void withdraw(Long userId) {

        int updated = userInfoMapper.withdrawUser(userId);

        if (updated == 0) {
            throw new IllegalStateException("회원 탈퇴 실패");
        }
    }
}
