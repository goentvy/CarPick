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


    // 회원가입
    // 회원가입<로컬로그인> , <소셜로그인> 구분
    void insertLocalUser(SignupRequest request);

    // 4. [수정 핵심] 소셜 회원가입 (Entity 사용)
    // 보안을 위해 Client가 추출한 정보로 만든 Entity를 직접 전달합니다.
    void insertSocialUser(User user);

    // 이메일 중복 체크
    int existsByEmail(@Param("email") String email);

    // 소셜 계정 존재 여부
    int existsByProvider(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );


}
