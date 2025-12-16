package com.carpick.domain.auth.mapper;

import com.carpick.domain.auth.dto.SignupRequest;
import com.carpick.domain.auth.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    // 로그인 (로컬)
    User findByEmail(@Param("email") String email);

    // 소셜 로그인
    User findByProvider(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );

    // PK 조회
    User findById(@Param("userId") Long userId);

    // 회원가입
    void insertUser(SignupRequest request);

    // 이메일 중복 체크
    int existsByEmail(@Param("email") String email);

    // 소셜 계정 존재 여부
    int existsByProvider(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );

    // 회원 기본 정보 수정
    int updateUserInfo(User user);

    // 비밀번호 변경 (로컬)
    int updatePassword(
            @Param("userId") Long userId,
            @Param("passwordHash") String passwordHash
    );

    // 멤버십 등급 변경 (관리자)
    int updateMembershipGrade(
            @Param("userId") Long userId,
            @Param("membershipGrade") String membershipGrade
    );

    // 회원 탈퇴 (소프트 삭제)
    int deleteUser(@Param("userId") Long userId);
}
