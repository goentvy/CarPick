package com.carpick.domain.userinfo.service;

import com.carpick.domain.userinfo.entity.UserInfo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carpick.domain.userinfo.dto.UserInfoResponse;
import com.carpick.domain.userinfo.dto.UserInfoUpdateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final com.carpick.domain.userinfo.mapper.UserInfoMapper userInfoMapper;
    private final PasswordEncoder passwordEncoder;

    public UserInfoResponse getUserInfo(Long userId) {
        //개인정보 조회 처리 로직
        UserInfo user = userInfoMapper.selectByUserId(userId);

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
                user.getMembershipGrade(),
                user.getProvider()
        );
    }

    //개인 정보 수정 로직 처리
    @Transactional
    public void updateUserInfo(Long userId, UserInfoUpdateRequest request) {
        // 로그 추가: 프론트에서 넘어온 값을 직접 확인
        System.out.println("DEBUG: 넘어온 데이터 확인 -> " + request.toString());

        // 만약 여기서 passwordHash=null 이라고 뜬다면 프론트와 이름이 안 맞는 것입니다.

        // 1. 요청으로 들어온 비밀번호가 있다면 암호화 진행
        String encodedPassword = null;
        if (request.password() != null && !request.password().isEmpty()) {
            encodedPassword = passwordEncoder.encode(request.password());
        }

        // 2. 암호화된 비밀번호를 매퍼에 전달
        int updated = userInfoMapper.updateUserInfo(
                userId,
                request.name(),
                request.phone(),
                request.birth(),
                encodedPassword, // 암호화된 비밀번호 사용
                request.marketingAgree()
        );


        if (updated == 0) {
            throw new IllegalStateException("회원 정보 수정 실패");
        }


    }

    //개인 정보 탈퇴 처리 로직
    @Transactional
    public void withdraw(Long userId) {
        UserInfo user = userInfoMapper.findById(userId);

        if (user == null) {
            throw new IllegalArgumentException("사용자 없음");
        }

        userInfoMapper.markDeleted(userId); // deleted_at = now()


        int updated = userInfoMapper.withdrawUser(userId);

        if (updated == 0) {
            throw new IllegalStateException("회원 탈퇴 실패");
        }
    }


}
