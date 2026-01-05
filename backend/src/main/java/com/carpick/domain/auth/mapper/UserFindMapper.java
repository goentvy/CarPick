package com.carpick.domain.auth.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserFindMapper {


    int existsForResetPassword(@Param("email") String email);

    int updatePassword(
            @Param("email") String email,
            @Param("password") String password
    );

    String findEmailByNameAndPhone(
            @Param("name") String name,
            @Param("phone") String phone
    );
}
