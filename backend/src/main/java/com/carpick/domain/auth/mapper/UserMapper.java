package com.carpick.domain.auth.mapper;

import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    // =====================
    // SELECT
    // =====================

    User findByEmail(@Param("email") String email);

    User findByProvider(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );

    User findDeletedByProvider(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );

    User findById(@Param("userId") Long userId);

    int existsByEmail(@Param("email") String email);

    // =====================
    // INSERT
    // =====================

    void insertLocalUser(User user);

    void insertSocialUser(User user);

    // =====================
    // UPDATE
    // =====================

    void updateAccessToken(
            @Param("userId") Long userId,
            @Param("accessToken") String accessToken
    );

    void reviveSocialUser(
            @Param("userId") Long userId,
            @Param("accessToken") String accessToken
    );

    void reviveSocialUserFull(
            @Param("userId") Long userId,
            @Param("accessToken") String accessToken,
            @Param("email") String email,
            @Param("name") String name
    );

    // =====================
    // DELETE
    // =====================

    void softDeleteLocalUser(@Param("userId") Long userId);

    void softDeleteSocialUser(@Param("userId") Long userId);

    void hardDeleteSocialUser(@Param("userId") Long userId);

    void reviveSocialUserBasic(
            Long userId,
            String email,
            String name
    );
    void unlinkSocialAccount(Long userId);

}
