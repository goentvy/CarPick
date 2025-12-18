package com.carpick.admin.useradmin.mapper;

import com.carpick.admin.useradmin.entity.UserAdmin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserAdminMapper {

    List<UserAdmin> findUsers(@Param("search") String search);

    UserAdmin findUserById(@Param("id") Long id);

    void insertUser(UserAdmin user);

    void updateUser(UserAdmin user);

    void deleteUser(@Param("id") Long id);
}
