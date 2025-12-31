package com.carpick.domain.auth.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserFindMapper {

    String findEmailByNameAndEmail(
            @Param("name") String name,
            @Param("email") String email
    );

    int existsForResetPassword(@Param("email") String email);

    int updatePassword(
            @Param("email") String email,
            @Param("password") String password
    );
}
