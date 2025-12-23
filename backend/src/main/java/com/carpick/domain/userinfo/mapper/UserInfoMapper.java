package com.carpick.domain.userinfo.mapper;

import com.carpick.domain.userinfo.entity.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

@Mapper
public interface UserInfoMapper {

    UserInfo selectByUserId(@Param("userId") Long userId);

    int updateUserInfo(
            @Param("userId") Long userId,
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("birth") LocalDate birth,
            @Param("passwordHash") String passwordHash,
            @Param("marketingAgree") boolean marketingAgree
    );

    int withdrawUser(@Param("userId") Long userId);

    // 멤버십 등급 변경 (관리자)
    int updateMembershipGrade(
            @Param("userId") Long userId,
            @Param("membershipGrade") String membershipGrade
    );
}
