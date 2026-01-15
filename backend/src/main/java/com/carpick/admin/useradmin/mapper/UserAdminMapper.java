package com.carpick.admin.useradmin.mapper;

import com.carpick.admin.useradmin.dto.UserAdminRequest;
import com.carpick.admin.useradmin.dto.UserAdminResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserAdminMapper {

    List<UserAdminResponse> selectUsers(
            @Param("search") String search,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    int countUsers(@Param("search") String search);

    UserAdminResponse selectUserById(@Param("id") Long id);

    int insertUser(UserAdminRequest request);

    int updateUser(UserAdminRequest request);

    int deleteUser(@Param("id") Long id);
    
    // ✅ 이번 주 가입자 수
    int countWeeklyJoinedUsers();

    // ✅ 이번 달 가입자 수
    int countMonthlyJoinedUsers();

    // ✅ 최근 가입 회원 목록
    List<UserAdminResponse> selectRecentJoinedUsers(@Param("limit") int limit);
}
