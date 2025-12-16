package com.carpick.mapper;

import com.carpick.dto.SignupRequest;
import com.carpick.model.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE email = #{email}")
    User findByEmail(String email);

    @Select("SELECT COUNT(*) FROM users WHERE email = #{email}")
    int existsByEmail(String email);

    @Insert("""
                INSERT INTO users (
                    email,
                    password_hash,
                    name,
                    phone,
                    birth,
                    gender,
                    marketing_agree,
                    provider,
                    provider_id,
                    membership_grade
                ) VALUES (
                    #{email},
                    #{password},
                    #{name},
                    #{phone},
                    #{birth},
                    #{gender},
                    #{marketingAgree},
                    'local',
                    NULL,
                    'BASIC'
                )
            """)
    int insertUser(SignupRequest dto);

    @Select("""
                SELECT *
                FROM users
                ORDER BY created_at DESC
                LIMIT 1
            """)
    User findLatestUser();
}
