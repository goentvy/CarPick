package com.carpick.domain.auth.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RefreshTokenMapper {

    void save(
            @Param("userId") Long userId,
            @Param("token") String token
    );

    String findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
