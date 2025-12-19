package com.carpick.domain.userinfo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.domain.userinfo.dto.UserInfoResponse;
import com.carpick.domain.userinfo.dto.UserInfoUpdateRequest;
import com.carpick.domain.userinfo.service.UserInfoService;
import com.carpick.global.security.details.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserInfoController {

    private final UserInfoService userInfoService;

    // 개인정보 조회
    @GetMapping("/me")
    public UserInfoResponse getUserInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return userInfoService.getUserInfo(userDetails.getUserId());
    }

    // 개인정보 수정
    @PutMapping("/me")
    public void updateUserInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserInfoUpdateRequest request
    ) {
        userInfoService.updateUserInfo(
                userDetails.getUserId(),
                request
        );
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    public void withdraw(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        userInfoService.withdraw(userDetails.getUserId());
    }
}
