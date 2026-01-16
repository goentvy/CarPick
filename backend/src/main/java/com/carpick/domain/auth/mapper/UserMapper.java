package com.carpick.domain.auth.mapper;

import com.carpick.domain.auth.dto.signup.SignupRequest;
import com.carpick.domain.auth.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

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

    void insertLocalUser(SignupRequest request);

    void insertSocialUser(User user);

    int existsByEmail(@Param("email") String email);

    void softDeleteLocalUser(@Param("userId") Long userId);

    void softDeleteSocialUser(@Param("userId") Long userId);

    void hardDeleteSocialUser(@Param("userId") Long userId);

    void reviveSocialUser(
            @Param("accessToken") String accessToken,
            @Param("userId") Long userId
    );

    void reviveSocialUserFull(
            @Param("userId") Long userId,
            @Param("accessToken") String accessToken,
            @Param("email") String email,
            @Param("name") String name
    );

    void updateAccessToken(
            @Param("userId") Long userId,
            @Param("accessToken") String accessToken
    );
}
