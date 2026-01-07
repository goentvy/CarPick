package com.carpick.domain.userinfo.mapper;

import com.carpick.domain.userinfo.entity.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

@Mapper
public interface UserInfoMapper {

    /* =========================
       조회
    ========================= */

    UserInfo findById(@Param("userId") Long userId);

    /* =========================
       개인정보 수정
    ========================= */

    int updateUserInfo(
            @Param("userId") Long userId,
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("birth") LocalDate birth,
            @Param("password") String password,
            @Param("marketingAgree") boolean marketingAgree
    );

    /* =========================
       탈퇴 처리
       - LOCAL  : 하드 탈퇴
       - SOCIAL : 소프트 탈퇴
    ========================= */

    // 로컬 로그인 유저 → 하드 탈퇴
    int deleteUser(@Param("userId") Long userId);

    // 소셜 로그인 유저 → 소프트 탈퇴
    int softDeleteUser(@Param("userId") Long userId);

    /* =========================
       관리자 기능
    ========================= */

    int updateMembershipGrade(
            @Param("userId") Long userId,
            @Param("membershipGrade") String membershipGrade
    );
}
