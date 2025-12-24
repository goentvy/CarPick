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

    // 회원가입 (로컬)
    void insertLocalUser(SignupRequest request);

    // 회원가입 (소셜)
    void insertSocialUser(User user);

    // 이메일 중복 체크
    int existsByEmail(@Param("email") String email);

    // 소셜 계정 존재 여부
    int existsByProvider(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );

    // ✅ userId로 조회
    User findById(@Param("userId") Long userId);

    // ✅ 회원 탈퇴 처리 (deleted_at 업데이트)
    void deleteUser(@Param("userId") Long userId);

    // ✅ 카카오 액세스 토큰 업데이트 (연동 해제 시 필요)
    void updateAccessToken(
            @Param("userId") Long userId,
            @Param("accessToken") String accessToken
    );
}
