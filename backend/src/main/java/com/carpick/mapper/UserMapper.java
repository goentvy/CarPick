package com.carpick.mapper;

import com.carpick.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM users WHERE email = #{email}")
    User findByEmail(Object email);
}
