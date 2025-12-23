package com.carpick.domain.auth.mapper;

import com.carpick.domain.auth.dto.SignupRequest;
import com.carpick.domain.auth.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    // 로그인 (로컬)
    User findByEmail(@Param("email") String email);

//    // 소셜 로그인
//    User findByProvider(
//            @Param("provider") String provider,
//            @Param("providerId") String providerId
//    );


    // 회원가입
    // 회원가입<로컬로그인> , <소셜로그인> 구분
    void insertLocalUser(SignupRequest request);

    void insertSocialUser(SignupRequest request);

    // 이메일 중복 체크
    int existsByEmail(@Param("email") String email);

//    // 소셜 계정 존재 여부
//    int existsByProvider(
//            @Param("provider") String provider,
//            @Param("providerId") String providerId
//    );


}
